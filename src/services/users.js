import crypto from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import { SessionsCollection } from '../db/models/sessionModel.js';
import generateTokens from '../utils/generateTokens.js';
import sendMail from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import { ENV_VARS, TEMPLATE_SOURCE } from '../const/const.js';
import { UsersCollection } from '../db/models/userModel.js';
import { getLocalizedMessage } from '../utils/i18nHelper.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

export async function registerUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user)
    throw createHttpError(409, getLocalizedMessage(req, 'error.emailInUse'));

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const createdUser = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });

  await SessionsCollection.deleteOne({ userId: createdUser._id });

  const session = await SessionsCollection.create({
    userId: createdUser._id,
    ...generateTokens(),
  });

  return {
    createdUser,
    session,
  };
}

export async function loginUser(payload) {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(
      401,
      getLocalizedMessage(req, 'error.invalidCredentials'),
    );
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual)
    throw createHttpError(
      401,
      getLocalizedMessage(req, 'error.invalidCredentials'),
    );

  await SessionsCollection.deleteOne({ userId: user._id });

  return await SessionsCollection.create({
    userId: user._id,
    ...generateTokens(),
  });
}

export async function refreshUserSession(refreshToken) {
  const session = await SessionsCollection.findOne({
    refreshToken,
  });
  if (!session)
    throw createHttpError(
      404,
      getLocalizedMessage(req, 'error.sessionNotFound'),
    );

  if (session.refreshTokenValidUntil < Date.now()) {
    throw createHttpError(
      401,
      getLocalizedMessage(req, 'error.refreshTokenExpired'),
    );
  }

  await SessionsCollection.deleteOne({ userId: session.userId });

  return await SessionsCollection.create({
    userId: session.userId,
    ...generateTokens(),
  });
}

export async function logoutUser(refreshToken) {
  return await SessionsCollection.deleteOne({ refreshToken });
}

export async function sendResetEmail(email) {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, getLocalizedMessage(req, 'error.userNotFound'));
  }

  const token = jwt.sign({ sub: user._id, email }, env(ENV_VARS.JWT_SECRET), {
    expiresIn: '5m',
  });

  const template = handlebars.compile(TEMPLATE_SOURCE.toString());

  const html = template({
    name: user.name,
    link: `https://aqua-track-front.vercel.app/reset-password?token=${token}`,
  });

  try {
    await sendMail({
      from: env(ENV_VARS.SMTP_FROM),
      to: email,
      subject: 'Change your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      getLocalizedMessage(req, 'error.emailSendFailed'),
    );
  }
}

export async function resetPassword(payload) {
  let entries;

  try {
    entries = jwt.verify(payload.token, env(ENV_VARS.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(401, getLocalizedMessage(req, error.message));
    }
    throw createHttpError(
      401,
      getLocalizedMessage(req, 'error.tokenExpiredOrInvalid'),
    );
  }

  const user = await UsersCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });

  if (!user) {
    throw createHttpError(404, getLocalizedMessage(req, 'error.userNotFound'));
  }

  const newPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne({ _id: user._id }, { password: newPassword });

  await SessionsCollection.findOneAndDelete({ userId: user._id });
}

export async function getCurrentUserData(email) {
  const user = UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, getLocalizedMessage(req, 'error.userNotFound'));
  }

  return user;
}

export async function updateUser(user, { avatar, ...payload }) {
  const rawResult = await UsersCollection.findOneAndUpdate(
    { email: user.email },
    { avatar, ...payload },
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, getLocalizedMessage(req, 'error.userNotFound'));
  }

  return rawResult.value;
}

export async function getAllRegisteredUsers() {
  const [usersCount, users] = await Promise.all([
    UsersCollection.find().countDocuments(),
    UsersCollection.find(),
  ]);

  if (!users) {
    throw createHttpError(404, getLocalizedMessage(req, 'error.usersNotFound'));
  }

  return { usersCount, users };
}

export async function loginOrSignupWithGoogle(code) {
  const loginTicket = validateCode(code);
  const tokenPayload = (await loginTicket).getPayload();

  if (!tokenPayload)
    throw createHttpError(401, getLocalizedMessage(req, 'error.unauthorized'));

  let user = await UsersCollection.findOne({ email: tokenPayload.email });

  if (!user) {
    const hashedPassword = await bcrypt.hash(crypto.randomBytes(20), 10);

    user = await UsersCollection.create({
      name: getFullNameFromGoogleTokenPayload(tokenPayload),
      email: tokenPayload.email,
      password: hashedPassword,
    });
  }

  await SessionsCollection.deleteOne({
    userId: user._id,
  });

  return await SessionsCollection.create({
    userId: user._id,
    ...generateTokens(),
  });
}

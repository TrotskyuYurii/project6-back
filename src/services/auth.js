import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../const/const.js';
import { UserCollection } from '../models/user.js';
import { SessionCollection } from '../models/session.js';
import {sendMail} from '../utils/sendMail.js';


const createSession = () => {
    return {
      accessToken: crypto.randomBytes(40).toString('base64'),
      refreshToken: crypto.randomBytes(40).toString('base64'),
      accessTokenValidUntil: Date.now() + 1000 * 60 * 15, // 15 minutes,
      refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days,
    };
  };



export const createUser = async (payload) => {
    
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await UserCollection.findOne({ email: payload.email });
  
    if (user) {
      throw createHttpError(
        409,
        'Email in use',
      );
    }
  
    return await UserCollection.create({
      ...payload,
      password: hashedPassword,
    });
  };



  export const loginUser = async ({ email, password }) => {
    const user = await UserCollection.findOne({ email });
  
    if (!user) {
      throw createHttpError(401, 'User not found!');
    }
  
    const areEqual = await bcrypt.compare(password, user.password);
  
    if (!areEqual) {
      throw createHttpError(401, 'Unauthorized');
    }
  
    await SessionCollection.deleteOne({ userId: user._id });
  
    return await SessionCollection.create({
      userId: user._id,
      ...createSession(),
    });
  };



  export const logoutUser = async ({ sessionId, sessionToken }) => {
    return await SessionCollection.deleteOne({
    _id: sessionId,
    refreshToken: sessionToken,
    });
  };



  export const refreshSession = async ({ sessionId, sessionToken }) => {
    const session = await SessionCollection.findOne({
        _id: sessionId,
      refreshToken: sessionToken,
    });
  
    if (!session) {
      throw createHttpError(401, 'Session not found!');
    }
  
    if (new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Refresh token is expired!');
    }
  
    const user = await UserCollection.findById(session.userId);
  
    if (!user) {
      throw createHttpError(401, 'Session not found!');
    }
  
    await SessionCollection.deleteOne({ userId: sessionId });
  
    return await SessionCollection.create({
        userId: user._id,
      ...createSession(),
    });
  };



  export const sendResetPassword = async (email) => {
    const user = await UserCollection.findOne({ email });
  
    if (!user) {
      throw createHttpError(404, 'User is not found!');
    }
  
    const token = jwt.sign(
      {
        sub: user._id,
        email,
      },
      env(ENV_VARS.JWT_SECRET),
      {
        expiresIn: 600, // 10 minutes
      },
    );
  
    // const templateSource = await fs.readFile(
    //   path.join(TEMPLATE_DIR, 'send-reset-password-email.html'),
    // );
  
    // const template = Handlebars.compile(templateSource.toString());
  
    // const html = template({
    //   name: user.name,
    //   link: `${env(ENV_VARS.FRONTEND_HOST)}/reset-password?token=${token}`,
    // });

    

    const html = `<a href="${env(ENV_VARS.APP_DOMAIN)}/reset-pwd?token=${token}">Reset your password</a>`
  
    try {
      await sendMail({
        html,
        to: email,
        from: env(ENV_VARS.SMTP_FROM),
        subject: 'Reset your password!',
      });
    } catch (err) {
      throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
  };


  export const resetPassword = async ({ token, password }) => {
    let tokenPayload;
    try {
      tokenPayload = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
    } catch (err) {
      throw createHttpError(401, "Token is expired or invalid.");
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await UserCollection.findOneAndUpdate(
      {
        _id: tokenPayload.sub,
        email: tokenPayload.email,
      },
      { password: hashedPassword },
    );
  };
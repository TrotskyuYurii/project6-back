import {
  getAllRegisteredUsers,
  getCurrentUserData,
  loginOrSignupWithGoogle,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  resetPassword,
  sendResetEmail,
  updateUser,
} from '../services/users.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import setupCookies from '../utils/setupCookies.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import i18next from '../i18n.js';
import { getLocalizedMessage } from '../utils/i18nHelper.js';

export async function registerUserContoller(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: getLocalizedMessage(req, 'registration.success'),
    data: user,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'login.success'),
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function getAllRegisteredUsersController(req, res) {
  const { usersCount, users } = await getAllRegisteredUsers();

  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'users.getAllSuccess'),
    data: {
      totalRegisteredUsers: usersCount,
      users,
    },
  });
}

export async function getCurrentUserDataController(req, res) {
  const userData = await getCurrentUserData(req.user.email);

  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'user.getCurrentDataSuccess'),
    data: userData,
  });
}

export async function updateUserContoller(req, res) {
  const { body, user, file } = req;

  let avatar;

  if (file) {
    avatar = await saveFileToCloudinary(file);
  }

  const updatedUser = await updateUser(user, { avatar, ...body });

  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'user.updateSuccess'),
    data: updatedUser,
  });
}

export function getGoogleOAuthUrlController(req, res) {
  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'googleOAuth.urlSuccess'),
    data: {
      url: generateAuthUrl(),
    },
  });
}

export async function loginOrSignupWithGoogleController(req, res) {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupCookies(res, session);

  res.json({
    status: 200,
    message: getLocalizedMessage(req, 'googleOAuth.loginSuccess'),
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function refreshUsersSessionController(req, res) {
  const session = await refreshUserSession(req.cookies.refreshToken);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'session.refreshSuccess'),
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res) {
  if (req.cookies.refreshToken) {
    await logoutUser(req.cookies.refreshToken);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

export async function sendResetEmailController(req, res) {
  await sendResetEmail(req.body.email);

  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'resetEmail.sentSuccess'),
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: getLocalizedMessage(req, 'passwordChange.success'),
    data: {},
  });
}

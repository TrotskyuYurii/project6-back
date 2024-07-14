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

export async function registerUserContoller(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function getAllRegisteredUsersController(req, res) {
  const { usersCount, users } = await getAllRegisteredUsers();

  res.status(200).json({
    status: 200,
    message: 'Successfully get all registered users!',
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
    message: 'Successfully get current user data!',
    data: {
      userData,
    },
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
    message: 'Successfully update user data!',
    data: updatedUser,
  });
}

export function getGoogleOAuthUrlController(req, res) {
  res.status(200).json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
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
    message: 'Successfully logged in with Google OAuth!',
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
    message: 'Successfully refreshed a session!',
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
    message: 'Reset password email has been successfully sent!',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully changed!',
    data: {},
  });
}

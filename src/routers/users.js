import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginOrSignupWithGoogleSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  sendResetEmailSchema,
  updateUserSchema,
} from '../schemas/users.js';
import {
  getAllRegisteredUsersController,
  getCurrentUserDataController,
  getGoogleOAuthUrlController,
  loginOrSignupWithGoogleController,
  loginUserController,
  logoutUserController,
  refreshUsersSessionController,
  registerUserContoller,
  resetPasswordController,
  sendResetEmailController,
  updateUserContoller,
} from '../controllers/users.js';
import authenticate from '../middlewares/authenticate.js';
import { uploadPhoto } from '../middlewares/uploadPhoto.js';

const usersRouter = Router();

usersRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserContoller),
);

usersRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

usersRouter.get(
  '/registered-users',
  ctrlWrapper(getAllRegisteredUsersController),
);

usersRouter.get(
  '/current-user-data',
  authenticate,
  ctrlWrapper(getCurrentUserDataController),
);

usersRouter.patch(
  '/update',
  authenticate,
  uploadPhoto.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserContoller),
);

usersRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

usersRouter.post(
  '/confirm-oauth',
  validateBody(loginOrSignupWithGoogleSchema),
  ctrlWrapper(loginOrSignupWithGoogleController),
);

usersRouter.post(
  '/refresh',
  authenticate,
  ctrlWrapper(refreshUsersSessionController),
);

usersRouter.post('/logout', authenticate, ctrlWrapper(logoutUserController));

usersRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

usersRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default usersRouter;

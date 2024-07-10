import { createUser, loginUser, logoutUser, refreshSession, resetPassword, sendResetPassword } from "../services/auth.js";

//Ініціалізація сесій в куках
export const setupSessionCookies = (res, session) => {
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expire: 7 * 24 * 60 * 60,
    });
    res.cookie('sessionToken', session.refreshToken, {
      httpOnly: true,
      expire: 7 * 24 * 60 * 60,
    });
  };






//Реєстрація авторизація
export const registerUserController = async (req, res) => {
    const user = await createUser(req.body);
    const { password, ...userWithoutPassword } = user.toObject();
  
    res.json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { user: userWithoutPassword },
    });
  };


  export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);
  
    setupSessionCookies(res, session);
  
    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken: session.accessToken },
    });
  };


  export const logoutController = async (req, res) => {
    await logoutUser({
      sessionId: req.cookies.sessionId,
      sessionToken: req.cookies.sessionToken,
    });
  
    res.clearCookie('sessionId');
    res.clearCookie('sessionToken');
  
    res.status(204).send();
  };


  export const refreshTokenController = async (req, res) => {
    const { sessionId, sessionToken } = req.cookies;
    const session = await refreshSession({ sessionId, sessionToken });
  
    setupSessionCookies(res, session);
  
    res.json({
      status: 200,
      message: 'Token refreshed successfully!',
      data: { accessToken: session.accessToken },
    });
  };
  



  //Скидування пароля
  export const sendResetEmailController = async (req, res) => {

    await sendResetPassword(req.body.email);

    res.json({
      status: 200,
      message: 'Email sent successfully!',
    });
  };

  export const resetPasswordController = async (req, res) => {

    await resetPassword(req.body);

    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
    });
  }
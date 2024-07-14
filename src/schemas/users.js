import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().email(),
  weight: Joi.number().min(0).max(180),
  sportTime: Joi.number().min(0).max(14),
  waterNorma: Joi.number().min(0).max(15),
  gender: Joi.string().valid('woman', 'man').default('woman'),
  avatar: Joi.string(),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});

export const loginOrSignupWithGoogleSchema = Joi.object({
  code: Joi.string().required(),
});

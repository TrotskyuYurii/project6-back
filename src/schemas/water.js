import Joi from 'joi';

export const addWaterSchema = Joi.object({
  date: Joi.date().iso().required(), // Validate date in ISO 8601 format (YYYY-MM-DD)
  amount: Joi.number().min(50).max(1500).required(),
  time: Joi.string()
    .regex(/^\d{2}:\d{2}$/) // Validate time in HH:mm format
    .required(),
});

export const editWaterSchema = Joi.object({
  date: Joi.date().iso().required(), // Validate date in ISO 8601 format (YYYY-MM-DD)
  amount: Joi.number().min(50).max(1500).required(),
  time: Joi.string()
    .regex(/^\d{2}:\d{2}$/) // Validate time in HH:mm format
    .required(),
});

import Joi from 'joi';
import moment from 'moment';

const validateDate = (value, helpers) => {
  if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
    return helpers.message('"date" must be a valid date in the format DD-MM-YYYY');
  }
  return value;
};

const validateTime = (value, helpers) => {
  if (!moment(value, 'HH:mm', true).isValid()) {
    return helpers.message('"time" must be a valid time in the format HH:mm');
  }
  return value;
};

export const addWaterSchema = Joi.object({
  date: Joi.string().custom(validateDate, 'custom date validation').required(),
  amount: Joi.number().min(50).max(1500).required(),
  time: Joi.string().custom(validateTime, 'custom time validation').required(),
});

export const editWaterSchema = Joi.object({
  date: Joi.string().custom(validateDate, 'custom date validation').required(),
  amount: Joi.number().min(50).max(1500).required(),
  time: Joi.string().custom(validateTime, 'custom time validation').required(),
});
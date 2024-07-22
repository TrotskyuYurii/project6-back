//Функція обробки помилок у разі відсутності маршруту
import { getLocalizedMessage } from '../utils/i18nHelper.js';

export const notFoundHandler = (req, res) => {
  const message = getLocalizedMessage(req, 'error.routeNotFound') || 'Route not found';
  res.status(404).json({
    message: message,
  });
};
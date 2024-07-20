import { isHttpError } from 'http-errors';
import { getLocalizedMessage } from '../utils/i18nHelper.js';

export function errorHandlerMiddleware(err, req, res, next) {
  if (isHttpError(err)) {
    const message = getLocalizedMessage(req, `error.${err.status}`) || err.message;

    return res.status(err.status).json({
      status: err.status,
      message: message,
      errors: err.errors || [],
    });
  }

  const message = getLocalizedMessage(req, 'error.serverError') || 'Something went wrong';

  res.status(500).json({
    status: 500,
    message: message,
    data: {
      message: err.message,
    },
  });
}

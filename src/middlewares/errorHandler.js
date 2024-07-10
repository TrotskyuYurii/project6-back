import { isHttpError } from 'http-errors';

//Функція обробки помилок 
export const errorHandlerMiddleware = (error, req, res, next) => {

    if (isHttpError(error)) {
      res.status(error.status).json({
      status: error.status,
      message: error.message,
      data: {"message": error.message},
      errorsValidation: error.errors || [],
      });
    } else {
      res.status(500).json({
      status: 500,
      message: error.message,
      });
    }
  };
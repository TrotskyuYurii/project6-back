import fs from 'node:fs';
import swaggerUI from 'swagger-ui-express';
import createHttpError from 'http-errors';
import { SWAGGER_JSON } from '../const/const.js';
import { getLocalizedMessage } from '../utils/i18nHelper.js';

export default function swaggerDocs() {
  try {
    const swaggerFile = JSON.parse(fs.readFileSync(SWAGGER_JSON).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerFile)];
  } catch (error) {
    return (req, res, next) => {
      const message = getLocalizedMessage(req, 'error.cantLoadSwaggerDocs') || "Can't load swagger docs";
      next(createHttpError(500, message));
    };
  }
}

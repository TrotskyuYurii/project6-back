import fs from 'node:fs';
import swaggerUI from 'swagger-ui-express';
import createHttpError from 'http-errors';
import { SWAGGER_JSON } from '../const/const.js';

export default function swaggerDocs() {
  try {
    const swaggerFile = JSON.parse(fs.readFileSync(SWAGGER_JSON).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerFile)];
  } catch (error) {
    return (req, res, next) => {
      next(createHttpError(500, "Can't load swagger docs"));
    };
  }
}

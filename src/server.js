import express from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import swaggerDocs from './middlewares/swaggerDocs.js';

import { env } from './utils/env.js';
import { ENV_VARS } from './const/const.js';

import rootRouter from './routers/rootRouter.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  const PORT = Number(env(ENV_VARS.PORT, 3000));

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  app.use(cookiesParser());

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use('/api-docs', swaggerDocs());

  app.use(rootRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

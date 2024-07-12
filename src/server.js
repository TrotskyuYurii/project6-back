import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookiesParser from 'cookie-parser';
import { swagger } from './middlewares/swagger.js';

import { env } from './utils/env.js';
import { ENV_VARS, UPLOAD_DIR } from './const/const.js';

import rootRouter from './routers/rootRouter.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';


export const setupServer = () => {
  const app = express();

  const PORT = env(ENV_VARS.PORT, 3000);

  app.use(
    express.json({
      limit: '1mb',
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  app.use('/api-docs', swagger());

  app.use(cors());


  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(cookiesParser());

  app.use(rootRouter);

  app.use(errorHandlerMiddleware);
  app.use(notFoundHandler);


  // app.use(pino());
  // app.use(
  //     pino({
  //       transport: {
  //         target: 'pino-pretty',
  //       },
  //     }),
  //   );

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

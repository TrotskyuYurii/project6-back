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



//Запуск сервера
export const setupServer=()=> {

    //Ініціалізація сервера
    const app = express();

    //Додавання middleware для відображення API Reference
    app.use('/api-docs', swagger());
    
    // app.use(pino());
    // app.use(
    //     pino({
    //       transport: {
    //         target: 'pino-pretty',
    //       },
    //     }),
    //   );


    //Додавання middleware для обробки помилок
    app.use(cors());


    //Додавання middleware для парсингу JSON
    app.use(
      express.json({
        limit: '1mb',
        type: ['application/json', 'application/vnd.api+json'],
      }),
    );

    //Додавання middleware для статичних файлів
    app.use('/uploads', express.static(UPLOAD_DIR));

    //Додавання middleware для парсингу cookies
    app.use(cookiesParser());

    //Підключення маршрутів
    app.use(rootRouter);

    //підключення обробників помилок
    app.use(errorHandlerMiddleware);
    app.use(notFoundHandler);


    //Запуск сервера
    const PORT = env(ENV_VARS.PORT, 3000);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
}


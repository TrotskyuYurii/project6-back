import { Router } from 'express';
import waterRouter from './water.js';
import usersRouter from './users.js';

const rootRouter = Router();

rootRouter.use('/users', usersRouter);
rootRouter.use('/water', waterRouter);

export default rootRouter;

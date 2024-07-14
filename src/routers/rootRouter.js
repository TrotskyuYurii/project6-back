import { Router } from 'express';
import waterRouter from './water.js';
import usersRouter from './users.js';

const rootRouter = Router();

rootRouter.use('/water', waterRouter);
rootRouter.use('/users', usersRouter);

export default rootRouter;

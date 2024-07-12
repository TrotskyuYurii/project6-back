import { Router } from 'express';
import waterRouter from './water.js';
import authRouter from './auth.js';

const rootRouter = Router();

rootRouter.use('/water',waterRouter);
rootRouter.use('/auth',authRouter);

export default rootRouter;
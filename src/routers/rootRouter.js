import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const rootRouter = Router();

rootRouter.use('/contacts',contactsRouter);
rootRouter.use('/auth',authRouter);

export default rootRouter;
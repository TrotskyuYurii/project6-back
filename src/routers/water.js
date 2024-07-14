import { Router } from 'express';

// import { authenticate } from '../middlewares/authenticate.js';
import {
  addWaterController,
  editWaterByIdController,
  deleteWaterController,
  dayWaterController,
  monthWaterController,
  getAllUsersController
} from '../controllers/water.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateParams } from '../middlewares/validateParams.js';
import {
  addWaterSchema,
  editWaterSchema,
  dayParamSchema,
} from '../schemas/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const waterRouter = Router();

// waterRouter.use(authenticate);

waterRouter.post('/add', validateBody(addWaterSchema), ctrlWrapper(addWaterController));

waterRouter.put('/edit/:id', validateBody(editWaterSchema), ctrlWrapper(editWaterByIdController));

waterRouter.delete('/remove/:id', ctrlWrapper(deleteWaterController));

waterRouter.get('/count-users', ctrlWrapper(getAllUsersController));

waterRouter.get('/day/:date', validateParams(dayParamSchema), ctrlWrapper(dayWaterController));

waterRouter.get('/month/:date', validateParams(dayParamSchema), ctrlWrapper(monthWaterController));

// waterRouter.get('/today', ctrlWrapper(todayWaterController)); - не потрібен бо потрібно використовувати дату з фронта через різницю поясів між фронтом користувача та бекендом

export default waterRouter;
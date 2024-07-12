import { Router } from 'express';

// import { authenticate } from '../middlewares/authenticate.js';
import {
  addWaterController,
  editWaterByIdController,
  deleteWaterController,
  dayWaterController,
  monthWaterController,
  todayWaterController
} from '../controllers/water.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addWaterSchema,
  editWaterSchema,
} from '../validation/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const waterRouter = Router();

// waterRouter.use(authenticate);

waterRouter.post('/add', validateBody(addWaterSchema), ctrlWrapper(addWaterController));

waterRouter.put('/edit/:id', validateBody(editWaterSchema), ctrlWrapper(editWaterByIdController));

waterRouter.delete('/remove/:id', ctrlWrapper(deleteWaterController));

waterRouter.get('/day/:date', ctrlWrapper(dayWaterController));

waterRouter.get('/month/:date', ctrlWrapper(monthWaterController));

waterRouter.get('/today', ctrlWrapper(todayWaterController));

export default waterRouter;
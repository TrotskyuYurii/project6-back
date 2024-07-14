import { Router } from 'express';

// import { authenticate } from '../middlewares/authenticate.js';
import {
  addWaterController,
  editWaterByIdController,
  deleteWaterController,
  dayWaterController,
  monthWaterController
} from '../controllers/water.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateParams } from '../middlewares/validateParams.js';
import {
  addWaterSchema,
  editWaterSchema,
  dayParamSchema,
} from '../schemas/water.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import authenticate from '../middlewares/authenticate.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post('/add', validateBody(addWaterSchema), ctrlWrapper(addWaterController));

waterRouter.put('/edit/:id', validateBody(editWaterSchema), ctrlWrapper(editWaterByIdController));

waterRouter.delete('/remove/:id', ctrlWrapper(deleteWaterController));

waterRouter.get('/day/:date', validateParams(dayParamSchema), ctrlWrapper(dayWaterController));

waterRouter.get('/month/:date', validateParams(dayParamSchema), ctrlWrapper(monthWaterController));

export default waterRouter;

import { Router } from 'express';

import appAuthenticated from '@modules/account/infra/http/middlewares/appAuthenticated';
import CategoryController from '../controllers/CategoryController';

const appCategoryRouter = Router();

const categoryController = new CategoryController();

appCategoryRouter.use(appAuthenticated);

appCategoryRouter.get('/', categoryController.index);

export default appCategoryRouter;

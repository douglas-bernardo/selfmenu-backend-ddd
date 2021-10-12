import { Router } from 'express';

import appAuthenticated from '@modules/users/infra/http/middlewares/appAuthenticated';
import CategoryController from '../controllers/CategoryController';

const appCategoryRoutes = Router();

const categoryController = new CategoryController();

appCategoryRoutes.use(appAuthenticated);

appCategoryRoutes.get('/', categoryController.index);

export default appCategoryRoutes;

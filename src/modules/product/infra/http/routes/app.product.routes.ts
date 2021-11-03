import { Router } from 'express';

import appAuthenticated from '@modules/account/infra/http/middlewares/appAuthenticated';

import ProductController from '../controllers/ProductController';
import SearchProductsController from '../controllers/SearchProductsController';

const appProductsRouter = Router();

const productController = new ProductController();
const searchProductsController = new SearchProductsController();

appProductsRouter.use(appAuthenticated);

appProductsRouter.get('/', productController.index);
appProductsRouter.get('/search', searchProductsController.index);
appProductsRouter.get('/:id', productController.show);

export default appProductsRouter;

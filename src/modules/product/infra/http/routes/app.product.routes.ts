import { Router } from 'express';

import appAuthenticated from '@modules/account/infra/http/middlewares/appAuthenticated';

import ProductController from '../controllers/ProductController';
import SearchProductsController from '../controllers/SearchProductsController';

const appProductsRoutes = Router();

const productController = new ProductController();
const searchProductsController = new SearchProductsController();

appProductsRoutes.use(appAuthenticated);

appProductsRoutes.get('/', productController.index);
appProductsRoutes.get('/search', searchProductsController.index);
appProductsRoutes.get('/:id', productController.show);

export default appProductsRoutes;

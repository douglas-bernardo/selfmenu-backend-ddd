import { Router } from 'express';

import appAuthenticated from '@modules/users/infra/http/middlewares/appAuthenticated';

import ItemController from '../controllers/ItemController';
import SearchItemsController from '../controllers/SearchItemsController';

const appItemsRoutes = Router();

const itemController = new ItemController();
const searchItemsController = new SearchItemsController();

appItemsRoutes.use(appAuthenticated);

appItemsRoutes.get('/', itemController.index);
appItemsRoutes.get('/search', searchItemsController.index);
appItemsRoutes.get('/:id', itemController.show);

export default appItemsRoutes;

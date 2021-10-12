import { Router } from 'express';

import appAuthenticated from '@modules/users/infra/http/middlewares/appAuthenticated';
import ItemController from '../controllers/ItemController';

const appItemsRoutes = Router();

const itemController = new ItemController();

appItemsRoutes.use(appAuthenticated);

appItemsRoutes.get('/', itemController.index);

export default appItemsRoutes;

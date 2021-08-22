import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RestaurantController from '../controllers/RestaurantController';

const restaurantRouter = Router();

const restaurantController = new RestaurantController();

restaurantRouter.use(ensureAuthenticated);

restaurantRouter.post('/', restaurantController.create);

export default restaurantRouter;

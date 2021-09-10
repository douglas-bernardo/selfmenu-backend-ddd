import { Router } from 'express';

import tableRouter from '@modules/table/infra/http/routes/table.routes';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RestaurantController from '../controllers/RestaurantController';

const restaurantRouter = Router();

const restaurantController = new RestaurantController();

restaurantRouter.use(ensureAuthenticated);
restaurantRouter.use('/:id/tables', tableRouter);

restaurantRouter.post('/', restaurantController.create);
restaurantRouter.get('/', restaurantController.index);
restaurantRouter.get('/:id', restaurantController.show);

export default restaurantRouter;

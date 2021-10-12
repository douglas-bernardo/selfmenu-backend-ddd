import { Router } from 'express';

import tableRouter from '@modules/table/infra/http/routes/table.routes';
import tableTokensRouter from '@modules/table/infra/http/routes/table.tokens.routes';

import orderRouter from '@modules/order/infra/http/routes/order.routes';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RestaurantController from '../controllers/RestaurantController';

const restaurantRouter = Router();

const restaurantController = new RestaurantController();

restaurantRouter.use(ensureAuthenticated);

restaurantRouter.post('/', restaurantController.create);
restaurantRouter.get('/', restaurantController.index);
restaurantRouter.get('/:id', restaurantController.show);

restaurantRouter.use('/:restaurant_id/tables', tableRouter);
restaurantRouter.use('/:restaurant_id/table-tokens', tableTokensRouter);

restaurantRouter.use('/:restaurant_id/orders', orderRouter);

export default restaurantRouter;

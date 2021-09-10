import { Router } from 'express';

import OrderController from '../controllers/OrderController';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post('/', orderController.create);
orderRouter.get('/:restaurant_id/list', orderController.index);
orderRouter.get('/:id', orderController.show);

export default orderRouter;

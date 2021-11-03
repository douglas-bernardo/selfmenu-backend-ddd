import { Router } from 'express';

import OrderController from '../controllers/OrderController';

const orderRouter = Router();

const orderController = new OrderController();

orderRouter.get('/', orderController.index);
orderRouter.get('/:id', orderController.show);

export default orderRouter;

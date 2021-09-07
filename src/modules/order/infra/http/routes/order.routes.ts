import { Router } from 'express';

import OrderController from '../controllers/OrderController';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post('/:owner_id/create', orderController.create);

export default orderRouter;

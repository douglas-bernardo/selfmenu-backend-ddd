import { Router } from 'express';

import OrderController from '../controllers/OrderController';

const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post('/', orderController.create);

export default orderRouter;

import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import OrderController from '../controllers/OrderController';

const orderRouter = Router();

const orderController = new OrderController();

const product = Joi.object({
    id: Joi.string().uuid().required(),
    quantity: Joi.number().min(1).required(),
    details: Joi.string(),
}).required();

orderRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            table_token: Joi.string().required(),
            establishment_id: Joi.string().required(),
            products: Joi.array().items(product).required(),
        },
    }),
    orderController.create,
);

orderRouter.get('/', orderController.index);
orderRouter.get('/:id', orderController.show);

export default orderRouter;

import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import OrderController from '../controllers/OrderController';

const orderRouter = Router();
const orderController = new OrderController();

const objectSchema = Joi.object({
    id: Joi.string().uuid().required(),
    quantity: Joi.number().min(1).required(),
}).required();

const arraySchema = Joi.array().items(objectSchema).min(1).unique().required();

orderRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            table_token: Joi.string().required(),
            items: Joi.alternatives().try(objectSchema, arraySchema).required(),
        },
    }),
    orderController.create,
);
orderRouter.get('/:restaurant_id/list', orderController.index);
orderRouter.get('/:id', orderController.show);

export default orderRouter;

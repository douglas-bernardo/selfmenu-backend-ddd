import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import appAuthenticated from '@modules/account/infra/http/middlewares/appAuthenticated';
import OrderController from '../controllers/OrderController';
import OrderProductController from '../controllers/OrderProductController';
import OrderCancelController from '../controllers/OrderCancelController';

const appOrderRouter = Router();
appOrderRouter.use(appAuthenticated);

const orderController = new OrderController();
const orderProductController = new OrderProductController();
const orderCancelController = new OrderCancelController();

/**
 * List current table's orders
 */

appOrderRouter.get(
    '/',
    celebrate({
        [Segments.QUERY]: {
            table_id: Joi.string().required(),
            table_token: Joi.string().required(),
        },
    }),
    orderController.index,
);

/**
 * Create order
 */
const product = Joi.object({
    id: Joi.string().uuid().required(),
    quantity: Joi.number().min(1).required(),
    details: Joi.string().allow(null).allow(''),
}).required();

appOrderRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            table_token: Joi.string().required(),
            customer_name: Joi.string().required(),
            establishment_id: Joi.string().required(),
            products: Joi.array().items(product).required(),
        },
    }),
    orderController.create,
);

appOrderRouter.get('/:id', orderController.show);

appOrderRouter.delete(
    '/:id/remove-item',
    celebrate({
        [Segments.BODY]: {
            order_product_id: Joi.string().required(),
        },
    }),
    orderProductController.delete,
);

appOrderRouter.patch('/:id/cancel', orderCancelController.update);

export default appOrderRouter;

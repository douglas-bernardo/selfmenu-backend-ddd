import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';

import OrderController from '../controllers/OrderController';
import ListEstablishmentOrdersController from '../controllers/ListEstablishmentOrdersController';
import UpdateOrderStatusController from '../controllers/UpdateOrderStatusController';

const orderRouter = Router();
orderRouter.use(ensureAuthenticated);

const orderController = new OrderController();
const listEstablishmentOrdersController =
    new ListEstablishmentOrdersController();

const updateOrderStatusController = new UpdateOrderStatusController();

orderRouter.get('/', orderController.index);

orderRouter.get(
    '/list-establishment-orders',
    listEstablishmentOrdersController.index,
);

orderRouter.get('/:id', orderController.show);

orderRouter.patch(
    '/:id/update-status',
    celebrate({
        [Segments.BODY]: {
            status_order_id: Joi.number().required(),
        },
    }),
    updateOrderStatusController.update,
);

export default orderRouter;

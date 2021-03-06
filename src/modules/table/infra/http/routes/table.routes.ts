import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import TableController from '../controllers/TableController';
import CloseTableController from '../controllers/CloseTableController';

const tableRouter = Router();
const tableController = new TableController();
const closeTableController = new CloseTableController();

tableRouter.use(ensureAuthenticated);

tableRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            capacity: Joi.number().required(),
            waiter_id: Joi.string().required(),
            establishment_id: Joi.string().required(),
        },
    }),
    tableController.create,
);

tableRouter.get('/', tableController.index);

tableRouter.get('/:id', tableController.show);

tableRouter.patch(
    '/:id',
    celebrate({
        [Segments.BODY]: {
            status_table_id: Joi.number().required(),
        },
    }),
    tableController.update,
);

tableRouter.patch('/:id/close', closeTableController.update);

export default tableRouter;

import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import TableController from '../controllers/TableController';

const tableRouter = Router();
const tableController = new TableController();

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

export default tableRouter;

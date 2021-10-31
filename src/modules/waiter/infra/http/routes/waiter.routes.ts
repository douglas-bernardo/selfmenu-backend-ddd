import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import WaiterController from '../controllers/WaiterController';

const waiterRouter = Router();

const waiterController = new WaiterController();

waiterRouter.use(ensureAuthenticated);

waiterRouter.get('/', waiterController.index);
waiterRouter.get('/:id', waiterController.show);

waiterRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cpf: Joi.number().min(11).required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
            establishment_id: Joi.string().required(),
        },
    }),
    waiterController.create,
);

export default waiterRouter;

import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import EstablishmentController from '../controllers/EstablishmentController';

const establishmentRouter = Router();

const establishmentController = new EstablishmentController();
establishmentRouter.use(ensureAuthenticated);

establishmentRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cnpj: Joi.number().min(14).required(),
            description: Joi.string(),
            establishment_type_id: Joi.number().required(),
        },
    }),
    establishmentController.create,
);

establishmentRouter.get('/', establishmentController.index);

establishmentRouter.get('/:id', establishmentController.show);

export default establishmentRouter;

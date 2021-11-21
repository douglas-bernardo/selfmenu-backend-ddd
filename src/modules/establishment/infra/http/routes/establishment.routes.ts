import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import EstablishmentController from '../controllers/EstablishmentController';
import EstablishmentTypeController from '../controllers/EstablishmentTypeController';

const establishmentRouter = Router();

const establishmentController = new EstablishmentController();
establishmentRouter.use(ensureAuthenticated);

const establishmentTypes = new EstablishmentTypeController();

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

establishmentRouter.get('/types', establishmentTypes.index);

establishmentRouter.get('/:id', establishmentController.show);

establishmentRouter.put(
    '/:id',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().allow(null).allow(''),
            cnpj: Joi.number().min(14).allow(null),
            establishment_type_id: Joi.number().allow(null),
            description: Joi.string().allow(null).allow(''),
            active: Joi.boolean().allow(null),
        },
    }),
    establishmentController.update,
);

export default establishmentRouter;

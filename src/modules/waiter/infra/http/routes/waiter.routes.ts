import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import WaiterController from '../controllers/WaiterController';

const waiterRouter = Router();
const upload = multer(uploadConfig.multer);

const waiterController = new WaiterController();

waiterRouter.use(ensureAuthenticated);

waiterRouter.get('/', waiterController.index);
waiterRouter.get('/:id', waiterController.show);

waiterRouter.post(
    '/',
    upload.single('avatar'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cpf: Joi.number().min(11).required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
            establishment_id: Joi.string().required(),
            avatar: Joi.binary().allow(null),
        },
    }),
    waiterController.create,
);

waiterRouter.put(
    '/:id',
    upload.single('avatar'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().allow(null).allow(''),
            cpf: Joi.number().min(11).required(),
            username: Joi.string().allow(null).allow(''),
            password: Joi.string().allow(null).allow(''),
            establishment_id: Joi.string().allow(null),
            active: Joi.boolean().allow(null),
            avatar: Joi.binary().allow(null),
        },
    }),
    waiterController.update,
);

export default waiterRouter;

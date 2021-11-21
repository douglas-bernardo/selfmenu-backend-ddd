import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import ProductController from '../controllers/ProductController';

const productsRoutes = Router();
const upload = multer(uploadConfig.multer);

const productController = new ProductController();

productsRoutes.use(ensureAuthenticated);

productsRoutes.get('/', productController.index);

productsRoutes.get('/:id', productController.show);

productsRoutes.post(
    '/',
    upload.single('photo'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            description: Joi.string().allow(null).allow(''),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
            category_id: Joi.number().required(),
            photo: Joi.binary().allow(null),
        },
    }),
    productController.create,
);

productsRoutes.put(
    '/:id',
    upload.single('photo'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            description: Joi.string().allow(null).allow(''),
            price: Joi.number().allow(null),
            quantity: Joi.number().allow(null),
            category_id: Joi.number().allow(null),
            available: Joi.boolean().allow(null),
            photo: Joi.binary().allow(null),
        },
    }),
    productController.update,
);

export default productsRoutes;

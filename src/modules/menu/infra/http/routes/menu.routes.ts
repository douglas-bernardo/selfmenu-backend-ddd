import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import MenuController from '../controllers/MenuController';
import RemoveProductsController from '../controllers/RemoveProductsController';
import AddProductsController from '../controllers/AddProductsController';

const menuRouter = Router();

const menuController = new MenuController();
const removeProductController = new RemoveProductsController();
const addProductsController = new AddProductsController();

const item = Joi.object().keys({
    id: Joi.string().required(),
});

menuRouter.use(ensureAuthenticated);

menuRouter.get('/', menuController.index);

menuRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            title: Joi.string().required(),
            description: Joi.string(),
            establishment_id: Joi.string().required(),
            products: Joi.array().items(item),
        },
    }),
    menuController.create,
);

menuRouter.get('/:id', menuController.show);

menuRouter.patch(
    '/:id/add-product',
    celebrate({
        [Segments.BODY]: {
            products: Joi.array().items(item),
        },
    }),
    addProductsController.update,
);

menuRouter.patch(
    '/:id/remove-product',
    celebrate({
        [Segments.BODY]: {
            products: Joi.array().items(item),
        },
    }),
    removeProductController.update,
);

export default menuRouter;

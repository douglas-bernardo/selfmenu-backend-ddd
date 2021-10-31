import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import AccountsController from '../controllers/AccountController';
import AccountAvatarController from '../controllers/AccountAvatarController';
import AccountPlanController from '../controllers/AccountPlanController';

const accountsRouter = Router();
const upload = multer(uploadConfig.multer);

const accountsController = new AccountsController();
const accountPlanController = new AccountPlanController();
const accountAvatarController = new AccountAvatarController();

accountsRouter.get('/', ensureAuthenticated, accountsController.index);
accountsRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            email_confirmation: Joi.string().valid(Joi.ref('email')),
            profile_name: Joi.string().required(),
            password: Joi.string().required(),
        },
    }),
    accountsController.create,
);

accountsRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    accountAvatarController.create,
);

accountsRouter.patch(
    '/update-plan',
    ensureAuthenticated,
    accountPlanController.create,
);

export default accountsRouter;

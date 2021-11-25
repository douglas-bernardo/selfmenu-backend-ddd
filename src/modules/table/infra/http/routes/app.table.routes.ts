import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import appAuthenticated from '@modules/account/infra/http/middlewares/appAuthenticated';
import TableController from '../controllers/TableController';

const appTableRouter = Router();
const tableController = new TableController();

appTableRouter.use(appAuthenticated);

appTableRouter.patch(
    '/:id',
    celebrate({
        [Segments.BODY]: {
            status_table_id: Joi.number().required(),
        },
    }),
    tableController.update,
);

export default appTableRouter;

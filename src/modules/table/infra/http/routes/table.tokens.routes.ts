import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UpdateTableTokenController from '../controllers/UpdateTableTokenController';

const tableTokensRouter = Router();

const updateTokenTable = new UpdateTableTokenController();

tableTokensRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            table_number: Joi.number().required(),
            establishment_id: Joi.string().required(),
        },
    }),
    updateTokenTable.create,
);

export default tableTokensRouter;

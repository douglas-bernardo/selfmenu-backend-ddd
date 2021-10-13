import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsTableController from '../controllers/SessionsTableController';

const tableSessionsRouter = Router();

const sessionsTableController = new SessionsTableController();

tableSessionsRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().required(),
        },
    }),
    sessionsTableController.create,
);

export default tableSessionsRouter;

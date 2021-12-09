import { Router } from 'express';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import NotificationsController from '../controllers/NotificationsController';

const notificationRouter = Router();

const notificationsController = new NotificationsController();

notificationRouter.use(ensureAuthenticated);

notificationRouter.get('/', notificationsController.index);
notificationRouter.patch('/:id', notificationsController.update);

export default notificationRouter;

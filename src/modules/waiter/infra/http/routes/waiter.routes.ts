import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import WaiterController from '../controllers/WaiterController';

const waiterRouter = Router();

const waiterController = new WaiterController();

waiterRouter.use(ensureAuthenticated);

waiterRouter.get('/', waiterController.index);
waiterRouter.post('/', waiterController.create);

export default waiterRouter;

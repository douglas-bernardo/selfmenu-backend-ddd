import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import TableController from '../controllers/TableController';

const tableRouter = Router();

const tableController = new TableController();

tableRouter.use(ensureAuthenticated);

tableRouter.post('/', tableController.create);

export default tableRouter;

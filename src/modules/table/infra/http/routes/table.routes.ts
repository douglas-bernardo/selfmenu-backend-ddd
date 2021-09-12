import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import TableController from '../controllers/TableController';

const tableRouter = Router({ mergeParams: true });

const tableController = new TableController();

tableRouter.use(ensureAuthenticated);

tableRouter.post('/', tableController.create);
tableRouter.get('/', tableController.index);
tableRouter.get('/:id', tableController.show);

export default tableRouter;

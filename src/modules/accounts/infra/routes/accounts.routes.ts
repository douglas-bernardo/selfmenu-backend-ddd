import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AccountController from '../controllers/AccountController';

const accountRouter = Router();

const accountController = new AccountController();

accountRouter.use(ensureAuthenticated);

accountRouter.post('/', accountController.create);
accountRouter.get('/:id', accountController.show);

export default accountRouter;

import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import CategoryController from '../controllers/CategoryController';

const categoryRoutes = Router();

const categoryController = new CategoryController();

categoryRoutes.use(ensureAuthenticated);

categoryRoutes.post('/', categoryController.create);
categoryRoutes.get('/', categoryController.index);
categoryRoutes.get('/:id', categoryController.show);

export default categoryRoutes;

import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import MenuController from '../controllers/MenuController';
import RemoveItemsController from '../controllers/RemoveItemsController';
import AddItemsController from '../controllers/AddItemsController';

const menuRouter = Router();

const menuController = new MenuController();
const removeItemsController = new RemoveItemsController();
const addItemsController = new AddItemsController();

menuRouter.use(ensureAuthenticated);

menuRouter.get('/', menuController.index);
menuRouter.post('/', menuController.create);
menuRouter.get('/:id', menuController.show);

menuRouter.patch('/:id/remove', removeItemsController.update);
menuRouter.patch('/:id/add', addItemsController.update);

export default menuRouter;

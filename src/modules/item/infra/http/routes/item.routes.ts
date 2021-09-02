import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ItemController from '../controllers/ItemController';

const itemsRoutes = Router();
const upload = multer(uploadConfig);

const itemController = new ItemController();

itemsRoutes.use(ensureAuthenticated);

itemsRoutes.get('/', itemController.index);
itemsRoutes.post('/', upload.array('images'), itemController.create);

export default itemsRoutes;

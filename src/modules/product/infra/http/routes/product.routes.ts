import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import ProductController from '../controllers/ProductController';

const productsRoutes = Router();
const upload = multer(uploadConfig.multer);

const productController = new ProductController();

productsRoutes.use(ensureAuthenticated);

productsRoutes.get('/', productController.index);
productsRoutes.get('/:id', productController.show);
productsRoutes.post('/', upload.single('photo'), productController.create);

export default productsRoutes;

import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/account/infra/http/middlewares/ensureAuthenticated';
import CategoryController from '../controllers/CategoryController';
import CategoryImageCoverController from '../controllers/CategoryImageCoverController';

const categoryRoutes = Router();
const upload = multer(uploadConfig.multer);

const categoryController = new CategoryController();
const categoryImageCoverController = new CategoryImageCoverController();

categoryRoutes.use(ensureAuthenticated);

categoryRoutes.post(
    '/',
    upload.single('image_cover'),
    categoryController.create,
);
categoryRoutes.get('/', categoryController.index);
categoryRoutes.get('/:id', categoryController.show);

categoryRoutes.patch(
    '/:id/image-cover',
    ensureAuthenticated,
    upload.single('image_cover'),
    categoryImageCoverController.create,
);

export default categoryRoutes;

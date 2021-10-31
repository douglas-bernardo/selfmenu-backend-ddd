import { Router } from 'express';

import AppEstablishmentController from '../controllers/AppEstablishmentController';

const appEstablishmentRouter = Router();

const establishmentController = new AppEstablishmentController();

appEstablishmentRouter.get('/:id', establishmentController.show);

export default appEstablishmentRouter;

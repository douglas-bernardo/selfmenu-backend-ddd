import { Router } from 'express';

import AppRestaurantController from '../controllers/AppRestaurantController';

const appRestaurantRouter = Router();

const restaurantController = new AppRestaurantController();

appRestaurantRouter.get('/:id', restaurantController.show);

export default appRestaurantRouter;

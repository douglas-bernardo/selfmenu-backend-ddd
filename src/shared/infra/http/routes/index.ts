import { Router } from 'express';

import plansRouter from '@modules/users/infra/http/routes/plans.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import restaurantRouter from '@modules/restaurant/infra/http/routes/restaurant.routes';
import menuRouter from '@modules/menu/infra/http/routes/menu.routes';
import categoryRoutes from '@modules/item/infra/http/routes/category.routes';
import itemsRoutes from '@modules/item/infra/http/routes/item.routes';
import waiterRouter from '@modules/waiter/infra/http/routes/waiter.routes';

import tableSessionsRouter from '@modules/table/infra/http/routes/table.sessions.routes';
import appRestaurantRouter from '@modules/restaurant/infra/http/routes/app.restaurant.routes';
import appCategoryRoutes from '@modules/item/infra/http/routes/app.category.routes';
import appItemsRoutes from '@modules/item/infra/http/routes/app.item.routes';

const routes = Router();

/**
 * API Routes
 */

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/plans', plansRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/restaurants', restaurantRouter);
routes.use('/menus', menuRouter);
routes.use('/categories', categoryRoutes);
routes.use('/items', itemsRoutes);
routes.use('/waiters', waiterRouter);

/**
 * App Routes
 */
routes.use('/app/tables', tableSessionsRouter);
routes.use('/app/restaurants', appRestaurantRouter);
routes.use('/app/categories', appCategoryRoutes);
routes.use('/app/items', appItemsRoutes);

export default routes;

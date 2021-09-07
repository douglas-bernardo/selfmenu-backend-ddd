import { Router } from 'express';

import plansRouter from '@modules/users/infra/http/routes/plans.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import restaurantRouter from '@modules/restaurant/infra/http/routes/restaurant.routes';
import menuRouter from '@modules/menu/infra/http/routes/menu.routes';
import itemsRoutes from '@modules/item/infra/http/routes/item.routes';
import waiterRouter from '@modules/waiter/infra/http/routes/waiter.routes';
import tableRouter from '@modules/table/infra/http/routes/table.routes';
import orderRouter from '@modules/order/infra/http/routes/order.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/plans', plansRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/restaurant', restaurantRouter);
routes.use('/menu', menuRouter);
routes.use('/item', itemsRoutes);
routes.use('/waiter', waiterRouter);
routes.use('/table', tableRouter);
routes.use('/order', orderRouter);

export default routes;

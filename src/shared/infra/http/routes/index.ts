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
// import tableRouter from '@modules/table/infra/http/routes/table.routes';
import orderRouter from '@modules/order/infra/http/routes/order.routes';
import tokenTable from '@modules/table/infra/http/routes/tokenTable.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/plans', plansRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/restaurants', restaurantRouter);
routes.use('/menus', menuRouter);
routes.use('/items', itemsRoutes);
routes.use('/waiters', waiterRouter);
// routes.use('/tables', tableRouter);
routes.use('/table-token', tokenTable);
routes.use('/orders', orderRouter);

export default routes;

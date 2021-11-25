import { Router } from 'express';

import plansRouter from '@modules/account/infra/http/routes/plans.routes';
import accountRouter from '@modules/account/infra/http/routes/account.routes';
import profileRouter from '@modules/account/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/account/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/account/infra/http/routes/password.routes';
import establishmentRouter from '@modules/establishment/infra/http/routes/establishment.routes';
import menuRouter from '@modules/menu/infra/http/routes/menu.routes';
import categoryRoutes from '@modules/product/infra/http/routes/category.routes';
import productsRoutes from '@modules/product/infra/http/routes/product.routes';
import waiterRouter from '@modules/waiter/infra/http/routes/waiter.routes';
import tableRouter from '@modules/table/infra/http/routes/table.routes';
import appTableRouter from '@modules/table/infra/http/routes/app.table.routes';
import tableTokensRouter from '@modules/table/infra/http/routes/table.tokens.routes';
import tableSessionsRouter from '@modules/table/infra/http/routes/table.sessions.routes';
import orderRouter from '@modules/order/infra/http/routes/order.routes';
import appRestaurantRouter from '@modules/establishment/infra/http/routes/app.establishment.routes';
import appCategoryRouter from '@modules/product/infra/http/routes/app.category.routes';
import appProductsRouter from '@modules/product/infra/http/routes/app.product.routes';
import appOrderRouter from '@modules/order/infra/http/routes/app.order.routes';
import notificationRouter from '@modules/notifications/infra/http/routes/notifications.routes';

const routes = Router();

/**
 * API Routes
 */
routes.use('/account', accountRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/plans', plansRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/establishments', establishmentRouter);
routes.use('/menus', menuRouter);
routes.use('/categories', categoryRoutes);
routes.use('/products', productsRoutes);
routes.use('/waiters', waiterRouter);
routes.use('/tables', tableRouter);
routes.use('/table-tokens', tableTokensRouter);
routes.use('/orders', orderRouter);
routes.use('/notifications', notificationRouter);

/**
 * App Routes
 */
routes.use('/app/establishments', appRestaurantRouter);
routes.use('/app/products', appProductsRouter);
routes.use('/app/categories', appCategoryRouter);
routes.use('/app/sessions/tables', tableSessionsRouter);
routes.use('/app/tables', appTableRouter);
routes.use('/app/orders', appOrderRouter);

export default routes;

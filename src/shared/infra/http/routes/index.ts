import { Router } from 'express';

import plansRouter from '@modules/plans/infra/http/routes/plans.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import accountsRouter from '@modules/accounts/infra/routes/accounts.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import restaurantRouter from '@modules/restaurant/infra/http/routes/restaurant.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/account', accountsRouter);
routes.use('/plans', plansRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/restaurant', restaurantRouter);

export default routes;

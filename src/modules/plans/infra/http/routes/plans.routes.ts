import { Router } from 'express';

import CreatePlanService from '@modules/plans/services/CreatePlanService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const plansRouter = Router();

plansRouter.post('/', ensureAuthenticated, async (request, response) => {
    const { name, description } = request.body;

    const createPlanService = new CreatePlanService();

    const plan = await createPlanService.execute({ name, description });

    return response.json(plan);
});

export default plansRouter;

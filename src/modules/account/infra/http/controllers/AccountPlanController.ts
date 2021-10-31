import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateAccountPlanService from '@modules/account/services/UpdateAccountPlanService';

export default class AccountPlanController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { plan_id } = request.body;

        const updateAccountPlanService = container.resolve(
            UpdateAccountPlanService,
        );

        const accountEdited = await updateAccountPlanService.execute({
            account_id: request.account.id,
            plan_id,
        });

        return response.json(classToClass(accountEdited));
    }
}

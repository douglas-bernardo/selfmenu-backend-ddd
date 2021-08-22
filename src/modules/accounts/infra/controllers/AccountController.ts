import CreateAccountService from '@modules/accounts/services/CreateAccountService';
import ShowAccountService from '@modules/accounts/services/ShowAccountService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AccountController {
    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const accountService = container.resolve(ShowAccountService);

        const account = await accountService.execute({ id });

        return response.json(account);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { plan_id } = request.body;

        const createAccountService = container.resolve(CreateAccountService);

        const account = await createAccountService.execute({
            user_id,
            plan_id,
        });

        return response.json(account);
    }
}

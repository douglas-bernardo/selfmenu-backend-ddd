import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListAccountsService from '@modules/account/services/ListAccountsService';
import CreateAccountService from '@modules/account/services/CreateAccountService';

export default class AccountsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const createAccountService = container.resolve(ListAccountsService);
        const users = await createAccountService.execute();
        return response.json(classToClass(users));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { profile_name, email, password } = request.body;

        const createAccountService = container.resolve(CreateAccountService);

        const user = await createAccountService.execute({
            email,
            password,
            profile_name,
        });

        return response.json(classToClass(user));
    }
}

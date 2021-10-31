import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/account/services/UpdateProfileService';
import ShowProfileService from '@modules/account/services/ShowProfileService';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const account_id = request.account.id;

        const showProfileService = container.resolve(ShowProfileService);

        const account = await showProfileService.execute({ account_id });

        return response.json(classToClass(account));
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { profile_name, email, old_password, password } = request.body;

        const createAccountService = container.resolve(UpdateProfileService);

        const account = await createAccountService.execute({
            account_id,
            profile_name,
            email,
            old_password,
            password,
        });

        return response.json(classToClass(account));
    }
}

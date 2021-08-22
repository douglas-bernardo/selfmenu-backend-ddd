import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    old_password?: string;
    password?: string;
}

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const showProfileService = container.resolve(ShowProfileService);

        const user: IUser = await showProfileService.execute({ user_id });

        delete user.password;

        return response.json(user);
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { first_name, last_name, email, old_password, password } =
            request.body;

        const createUserService = container.resolve(UpdateProfileService);

        const user: IUser = await createUserService.execute({
            user_id,
            first_name,
            last_name,
            email,
            old_password,
            password,
        });

        delete user.password;

        return response.json(user);
    }
}

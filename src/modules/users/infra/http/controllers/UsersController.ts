import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListUsersService from '@modules/users/services/ListUsersService';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const createUserService = container.resolve(ListUsersService);
        const users = await createUserService.execute();
        return response.json(classToClass(users));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password, profile_name } = request.body;

        const createUserService = container.resolve(CreateUserService);

        const user = await createUserService.execute({
            email,
            password,
            profile_name,
        });

        return response.json(classToClass(user));
    }
}

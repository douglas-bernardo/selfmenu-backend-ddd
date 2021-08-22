import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUsersService from '@modules/users/services/ListUsersService';
import CreateUserService from '@modules/users/services/CreateUserService';

interface IUser {
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
}

export default class UsersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const createUserService = container.resolve(ListUsersService);
        const users = await createUserService.execute();
        return response.json(users);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password, first_name, last_name } = request.body;

        const createUserService = container.resolve(CreateUserService);

        const user: IUser = await createUserService.execute({
            email,
            password,
            first_name,
            last_name,
        });

        delete user.password;

        return response.json(user);
    }
}

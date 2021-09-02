import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

interface IUser {
    email: string;
    password?: string;
    profile_name: string;
}

export default class UserAvatarController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateUserAvatarService = container.resolve(
            UpdateUserAvatarService,
        );

        const user: IUser = await updateUserAvatarService.execute({
            user_id: request.user.id,
            avatarFileName: request.file?.filename ?? '',
        });

        delete user.password;
        return response.json(user);
    }
}

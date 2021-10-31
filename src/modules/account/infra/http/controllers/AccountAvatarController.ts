import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateAccountAvatarService from '@modules/account/services/UpdateAccountAvatarService';

interface IAccount {
    email: string;
    password?: string;
    profile_name: string;
}

export default class AccountAvatarController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const updateAccountAvatarService = container.resolve(
            UpdateAccountAvatarService,
        );

        const account: IAccount = await updateAccountAvatarService.execute({
            account_id: request.account.id,
            avatarFileName: request.file?.filename ?? '',
        });

        delete account.password;
        return response.json(classToClass(account));
    }
}

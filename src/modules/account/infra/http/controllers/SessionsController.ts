import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateAccountService from '@modules/account/services/AuthenticateAccountService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const authenticate = container.resolve(AuthenticateAccountService);

        const { account, token } = await authenticate.execute({
            email,
            password,
        });

        return response.json({ account: classToClass(account), token });
    }
}

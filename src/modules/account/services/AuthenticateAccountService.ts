import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import Account from '../infra/typeorm/entities/Account';
import IAccountsRepository from '../repositories/IAccountRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    account: Account;
    token: string;
}

@injectable()
class AuthenticateAccountService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const account = await this.accountsRepository.findByEmail(email);

        if (!account) {
            throw new AppError('Incorrect email/password', 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(
            password,
            account.password,
        );

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: account.id,
            expiresIn,
        });

        return {
            account,
            token,
        };
    }
}

export default AuthenticateAccountService;

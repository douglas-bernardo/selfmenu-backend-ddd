import { injectable, inject } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAccountsRepository from '../repositories/IAccountRepository';
import IAccountTokenRepository from '../repositories/IAccountTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('AccountTokenRepository')
        private accountTokenRepository: IAccountTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const accountToken = await this.accountTokenRepository.findByToken(
            token,
        );

        if (!accountToken) {
            throw new AppError('Account token does not exists');
        }

        const account = await this.accountsRepository.findById(
            accountToken.account_id,
        );

        if (!account) {
            throw new AppError('Account does not exists');
        }

        const tokenCreatedAt = accountToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token expired');
        }

        account.password = await this.hashProvider.generateHash(password);

        await this.accountsRepository.save(account);
    }
}

export default ResetPasswordService;

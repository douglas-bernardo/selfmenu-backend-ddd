import { injectable, inject } from 'tsyringe';

import Account from '@modules/account/infra/typeorm/entities/Account';
import AppError from '@shared/errors/AppError';
import IAccountsRepository from '../repositories/IAccountRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    account_id: string;
    profile_name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({
        account_id,
        profile_name,
        email,
        old_password,
        password,
    }: IRequest): Promise<Account> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        const accountWithUpdatedEmail =
            await this.accountsRepository.findByEmail(email);

        if (
            accountWithUpdatedEmail &&
            accountWithUpdatedEmail.id !== account_id
        ) {
            throw new AppError('E-mail already in use');
        }

        const accountEdited = Object.assign(account, {
            profile_name,
            email,
        });

        if (password && !old_password) {
            throw new AppError('Old password is required');
        }

        if (password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                account.password,
            );

            if (!checkOldPassword) {
                throw new AppError('Old password is wrong');
            }

            accountEdited.password = await this.hashProvider.generateHash(
                password,
            );
        }

        return this.accountsRepository.save(accountEdited);
    }
}

export default UpdateProfileService;

import { injectable, inject } from 'tsyringe';

import Account from '@modules/account/infra/typeorm/entities/Account';
import AppError from '@shared/errors/AppError';
import IAccountsRepository from '../repositories/IAccountRepository';

interface IRequest {
    account_id: string;
}

@injectable()
class ShowProfileService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
    ) {}

    public async execute({ account_id }: IRequest): Promise<Account> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        return account;
    }
}

export default ShowProfileService;

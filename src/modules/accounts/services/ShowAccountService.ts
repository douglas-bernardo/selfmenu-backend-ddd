import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountRepository from '../repositories/IAccountRepository';
import Account from '../infra/typeorm/entities/Account';

interface IRequest {
    id: string;
}

@injectable()
class ShowAccountService {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,
    ) {}

    public async execute({ id }: IRequest): Promise<Account> {
        const account = await this.accountRepository.findById(id);

        if (!account) {
            throw new AppError('Account not found');
        }

        return account;
    }
}

export default ShowAccountService;

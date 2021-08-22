import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountRepository from '../repositories/IAccountRepository';
import Account from '../infra/typeorm/entities/Account';

interface IRequest {
    user_id: string;
    plan_id: number;
}

@injectable()
class CreateAccountService {
    constructor(
        @inject('AccountRepository')
        private accountRepository: IAccountRepository,
    ) {}

    public async execute({ user_id, plan_id }: IRequest): Promise<Account> {
        const checkUserHasActiveAccount =
            await this.accountRepository.findByUserId(user_id);

        if (checkUserHasActiveAccount && checkUserHasActiveAccount.active) {
            throw new AppError('User already active account');
        }

        const account = await this.accountRepository.create({
            user_id,
            plan_id,
        });

        return account;
    }
}

export default CreateAccountService;

import { injectable, inject } from 'tsyringe';

import Account from '@modules/account/infra/typeorm/entities/Account';
import AppError from '@shared/errors/AppError';
import IAccountsRepository from '../repositories/IAccountRepository';
import IPlanRepository from '../repositories/IPlanRepository';

interface IRequest {
    account_id: string;
    plan_id: number;
}

@injectable()
class UpdateAccountPlanService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('PlanRepository')
        private planRepository: IPlanRepository,
    ) {}

    public async execute({ account_id, plan_id }: IRequest): Promise<Account> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        const plan = await this.planRepository.findById(plan_id);

        if (!plan) {
            throw new AppError('Plan not found');
        }

        account.plan = plan;

        return this.accountsRepository.save(account);
    }
}

export default UpdateAccountPlanService;

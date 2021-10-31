import { injectable, inject } from 'tsyringe';

import Account from '@modules/account/infra/typeorm/entities/Account';
import IAccountsRepository from '../repositories/IAccountRepository';

@injectable()
class ListAccountsService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
    ) {}

    public async execute(): Promise<Account[]> {
        return this.accountsRepository.findAll();
    }
}

export default ListAccountsService;

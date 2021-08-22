import { v4 as uuid } from 'uuid';

import ICreateAccountDTO from '@modules/accounts/dtos/ICreateAccountDTO';
import Account from '@modules/accounts/infra/typeorm/entities/Account';
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository';

class FakeAccountRepository implements IAccountRepository {
    private accounts: Account[] = [];

    public async findById(account_id: string): Promise<Account | undefined> {
        const findAccount = this.accounts.find(
            account => account.id === account_id,
        );

        return findAccount;
    }

    public async findByUserId(user_id: string): Promise<Account | undefined> {
        const findAccount = this.accounts.find(
            account => account.user_id === user_id,
        );

        return findAccount;
    }

    public async create(data: ICreateAccountDTO): Promise<Account> {
        const account = new Account();

        Object.assign(account, { id: uuid(), active: true }, data);

        this.accounts.push(account);

        return account;
    }

    public async save(account: Account): Promise<Account> {
        const findIndex = this.accounts.findIndex(
            findAccount => findAccount.id === account.id,
        );

        this.accounts[findIndex] = account;
        return account;
    }
}

export default FakeAccountRepository;

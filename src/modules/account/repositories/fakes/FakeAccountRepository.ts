import { v4 as uuid } from 'uuid';

import ICreateAccountDTO from '@modules/account/dtos/ICreateAccountDTO';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';

import Account from '@modules/account/infra/typeorm/entities/Account';

class FakeAccountsRepository implements IAccountsRepository {
    private accounts: Account[] = [];

    public async findAll(): Promise<Account[]> {
        return this.accounts;
    }

    public async findById(id: string): Promise<Account | undefined> {
        const findAccount = this.accounts.find(account => account.id === id);

        return findAccount;
    }

    public async findByEmail(email: string): Promise<Account | undefined> {
        const findAccount = this.accounts.find(
            account => account.email === email,
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

export default FakeAccountsRepository;

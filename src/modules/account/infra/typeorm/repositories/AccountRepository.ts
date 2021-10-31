import ICreateAccountDTO from '@modules/account/dtos/ICreateAccountDTO';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import { getRepository, Repository } from 'typeorm';

import Account from '../entities/Account';

class AccountsRepository implements IAccountsRepository {
    private ormRepository: Repository<Account>;

    constructor() {
        this.ormRepository = getRepository(Account);
    }

    public async findAll(): Promise<Account[]> {
        return this.ormRepository.find();
    }

    public async findById(id: string): Promise<Account | undefined> {
        const account = await this.ormRepository.findOne({
            where: {
                id,
            },
            relations: ['plan'],
        });

        return account;
    }

    public async findByEmail(email: string): Promise<Account | undefined> {
        const account = await this.ormRepository.findOne({
            where: {
                email,
            },
            relations: ['plan'],
        });

        return account;
    }

    public async create(data: ICreateAccountDTO): Promise<Account> {
        const account = this.ormRepository.create(data);

        await this.ormRepository.save(account);

        return account;
    }

    public async save(account: Account): Promise<Account> {
        return this.ormRepository.save(account);
    }
}

export default AccountsRepository;

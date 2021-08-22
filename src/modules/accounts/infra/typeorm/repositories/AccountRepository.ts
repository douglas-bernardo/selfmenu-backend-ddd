import ICreateAccountDTO from '@modules/accounts/dtos/ICreateAccountDTO';
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository';
import { getRepository, Repository } from 'typeorm';
import Account from '../entities/Account';

class AccountRepository implements IAccountRepository {
    private ormRepository: Repository<Account>;

    constructor() {
        this.ormRepository = getRepository(Account);
    }

    findAll(): Promise<Account[]> {
        throw new Error('Method not implemented.');
    }

    public async findById(account_id: string): Promise<Account | undefined> {
        const account = await this.ormRepository.findOne({
            where: {
                id: account_id,
            },
            relations: ['plan'],
        });
        return account;
    }

    public async findByUserId(user_id: string): Promise<Account | undefined> {
        const account = await this.ormRepository.findOne({
            where: {
                user_id,
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
}

export default AccountRepository;

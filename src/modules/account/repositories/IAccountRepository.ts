import ICreateAccountDTO from '@modules/account/dtos/ICreateAccountDTO';
import Account from '../infra/typeorm/entities/Account';

export default interface IAccountsRepository {
    findAll(): Promise<Account[]>;
    findById(id: string): Promise<Account | undefined>;
    findByEmail(email: string): Promise<Account | undefined>;
    create(data: ICreateAccountDTO): Promise<Account>;
    save(account: Account): Promise<Account>;
}

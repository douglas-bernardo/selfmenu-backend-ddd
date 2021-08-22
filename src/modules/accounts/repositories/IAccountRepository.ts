import ICreateAccountDTO from '../dtos/ICreateAccountDTO';
import Account from '../infra/typeorm/entities/Account';

export default interface IAccountRepository {
    findById(account_id: string): Promise<Account | undefined>;
    findByUserId(user_id: string): Promise<Account | undefined>;
    create(data: ICreateAccountDTO): Promise<Account>;
}

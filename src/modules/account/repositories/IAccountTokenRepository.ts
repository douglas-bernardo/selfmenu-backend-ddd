import AccountToken from '../infra/typeorm/entities/AccountToken';

export default interface IAccountTokenRepository {
    generate(account_id: string): Promise<AccountToken>;
    findByToken(token: string): Promise<AccountToken | undefined>;
}

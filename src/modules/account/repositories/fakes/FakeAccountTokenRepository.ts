import { v4 as uuid } from 'uuid';

import AccountToken from '@modules/account/infra/typeorm/entities/AccountToken';
import IAccountTokenRepository from '../IAccountTokenRepository';

class FakeAccountTokenRepository implements IAccountTokenRepository {
    private accountTokens: AccountToken[] = [];

    public async generate(account_id: string): Promise<AccountToken> {
        const accountToken = new AccountToken();

        Object.assign(accountToken, {
            id: uuid(),
            token: uuid(),
            account_id,
            created_at: new Date(),
            updated_at: new Date(),
        });

        this.accountTokens.push(accountToken);
        return accountToken;
    }

    public async findByToken(token: string): Promise<AccountToken | undefined> {
        const accountToken = this.accountTokens.find(
            findToken => findToken.token === token,
        );

        return accountToken;
    }
}

export default FakeAccountTokenRepository;

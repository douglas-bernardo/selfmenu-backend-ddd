import IAccountTokenRepository from '@modules/account/repositories/IAccountTokenRepository';
import { getRepository, Repository } from 'typeorm';

import AccountToken from '../entities/AccountToken';

class AccountsTokenRepository implements IAccountTokenRepository {
    private ormRepository: Repository<AccountToken>;

    constructor() {
        this.ormRepository = getRepository(AccountToken);
    }

    public async findByToken(token: string): Promise<AccountToken | undefined> {
        const accountToken = await this.ormRepository.findOne({
            where: {
                token,
            },
        });
        return accountToken;
    }

    public async generate(account_id: string): Promise<AccountToken> {
        const accountToken = this.ormRepository.create({
            account_id,
        });

        await this.ormRepository.save(accountToken);

        return accountToken;
    }
}

export default AccountsTokenRepository;

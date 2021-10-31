import { injectable, inject } from 'tsyringe';

import Account from '@modules/account/infra/typeorm/entities/Account';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IAccountsRepository from '../repositories/IAccountRepository';

interface IRequest {
    account_id: string;
    avatarFileName: string;
}

@injectable()
class UpdateAccountAvatarService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
        @inject('StorageProvider') private storageProvider: IStorageProvider,
    ) {}

    public async execute({
        account_id,
        avatarFileName,
    }: IRequest): Promise<Account> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError(
                'Only authenticated accounts can change avatar',
                401,
            );
        }

        if (account.avatar) {
            await this.storageProvider.deleteFile(account.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFileName);

        account.avatar = filename;
        await this.accountsRepository.save(account);

        return account;
    }
}

export default UpdateAccountAvatarService;

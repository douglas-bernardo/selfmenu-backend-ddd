import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import UpdateAccountAvatarService from './UpdateAccountAvatarService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateAccountAvatar: UpdateAccountAvatarService;

describe('UpdateAccountAvatar', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateAccountAvatar = new UpdateAccountAvatarService(
            fakeAccountsRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to update avatar from a account', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        await updateAccountAvatar.execute({
            account_id: account.id,
            avatarFileName: 'avatar.jpg',
        });

        expect(account.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing account', async () => {
        await expect(
            updateAccountAvatar.execute({
                account_id: 'non-existing-account',
                avatarFileName: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        await updateAccountAvatar.execute({
            account_id: account.id,
            avatarFileName: 'avatar.jpg',
        });

        await updateAccountAvatar.execute({
            account_id: account.id,
            avatarFileName: 'avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(account.avatar).toBe('avatar2.jpg');
    });
});

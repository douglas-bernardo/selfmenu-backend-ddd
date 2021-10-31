import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import UpdateProfileService from './UpdateProfileService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeAccountsRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update profile', async () => {
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

        const updatedAccount = await updateProfileService.execute({
            account_id: account.id,
            profile_name: 'John Tree',
            email: 'johntree@example.com',
        });

        expect(updatedAccount.profile_name).toBe('John Tree');
        expect(updatedAccount.email).toBe('johntree@example.com');
    });

    it('should not be able to update profile from non-existing account', async () => {
        expect(
            updateProfileService.execute({
                account_id: 'non-existing-account',
                profile_name: 'John Tree',
                email: 'johntree@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change to another account email', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        await fakeAccountsRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const account = await fakeAccountsRepository.create({
            profile_name: 'Test',
            email: 'test@example.com',
            password: '123456',
            plan_id: plan.id,
        });

        await expect(
            updateProfileService.execute({
                account_id: account.id,
                profile_name: 'John Doe',
                email: 'john@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update password', async () => {
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

        const updatedAccount = await updateProfileService.execute({
            account_id: account.id,
            profile_name: 'John Doe',
            email: 'john@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedAccount.password).toBe('123123');
    });

    it('should not be able to update password without old password', async () => {
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

        await expect(
            updateProfileService.execute({
                account_id: account.id,
                profile_name: 'John Doe',
                email: 'john@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update password with wrong old password', async () => {
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

        await expect(
            updateProfileService.execute({
                account_id: account.id,
                profile_name: 'John Doe',
                email: 'john@example.com',
                old_password: 'wrong-old-password',
                password: '456456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

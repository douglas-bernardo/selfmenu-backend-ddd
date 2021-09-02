import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update profile', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            profile_name: 'John Tree',
            email: 'johntree@example.com',
        });

        expect(updatedUser.profile_name).toBe('John Tree');
        expect(updatedUser.email).toBe('johntree@example.com');
    });

    it('should not be able to update profile from non-existing user', async () => {
        expect(
            updateProfileService.execute({
                user_id: 'non-existing-user',
                profile_name: 'John Tree',
                email: 'johntree@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change to another user email', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const user = await fakeUsersRepository.create({
            profile_name: 'Test',
            email: 'test@example.com',
            password: '123456',
            plan_id: plan.id,
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
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

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            profile_name: 'John Doe',
            email: 'john@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update password without old password', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
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

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                profile_name: 'John Doe',
                email: 'john@example.com',
                old_password: 'wrong-old-password',
                password: '456456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

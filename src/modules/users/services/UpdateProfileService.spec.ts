import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update profile', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            first_name: 'John Tree',
            last_name: 'Brew',
            email: 'johntree@example.com',
        });

        expect(updatedUser.first_name).toBe('John Tree');
        expect(updatedUser.email).toBe('johntree@example.com');
    });

    it('should not be able to update profile from non-existing user', async () => {
        expect(
            updateProfileService.execute({
                user_id: 'non-existing-user',
                first_name: 'John Tree',
                last_name: 'Brew',
                email: 'johntree@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            first_name: 'Test',
            last_name: 'Test',
            email: 'test@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                first_name: 'John Doe',
                last_name: 'Brow',
                email: 'john@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update password', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update password without old password', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                first_name: 'John Doe',
                last_name: 'Brow',
                email: 'john@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                first_name: 'John Doe',
                last_name: 'Brow',
                email: 'john@example.com',
                old_password: 'wrong-old-password',
                password: '456456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

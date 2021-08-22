import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let authenticateUsersService: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        authenticateUsersService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const user = await createUserService.execute({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const response = await authenticateUsersService.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUsersService.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await createUserService.execute({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            authenticateUsersService.execute({
                email: 'johndoe@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

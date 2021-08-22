import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();
        createUsersService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUsersService.execute({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with the same email from another', async () => {
        await createUsersService.execute({
            first_name: 'John Doe',
            last_name: 'Brow',
            email: 'john@example.com',
            password: '123456',
        });

        await expect(
            createUsersService.execute({
                first_name: 'John Doe',
                last_name: 'Brow',
                email: 'john@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

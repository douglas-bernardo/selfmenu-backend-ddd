import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();
        createUsersService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new user', async () => {
        await fakePlanRepository.create('Free', 'Selfmenu free plan');

        const user = await createUsersService.execute({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with the same email from another', async () => {
        await fakePlanRepository.create('Free', 'Selfmenu free plan');

        await createUsersService.execute({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
        });

        await expect(
            createUsersService.execute({
                email: 'john@example.com',
                password: '123456',
                profile_name: 'John Doe',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

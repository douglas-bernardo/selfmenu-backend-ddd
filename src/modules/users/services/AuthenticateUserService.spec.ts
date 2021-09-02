import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakePlanRepository: FakePlanRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUsersService: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();

        authenticateUsersService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
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
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
        });

        await expect(
            authenticateUsersService.execute({
                email: 'johndoe@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

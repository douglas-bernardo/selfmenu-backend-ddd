import FakePlanRepository from '@modules/plans/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeAccountRepository from '../repositories/fakes/FakeAccountRepository';
import CreateAccountService from './CreateAccountService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAccountRepository: FakeAccountRepository;
let fakePlanRepository: FakePlanRepository;
let createAccountService: CreateAccountService;

describe('CreateAccount', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeAccountRepository = new FakeAccountRepository();
        createAccountService = new CreateAccountService(fakeAccountRepository);
    });

    it('should be able to create a new account', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'Jackson',
            last_name: 'Douglas',
            email: 'jkdouglas21@gmail.com',
            password: '123123',
        });

        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await createAccountService.execute({
            user_id: user.id,
            plan_id: plan.id,
        });

        expect(account).toHaveProperty('id');
    });

    it('should not be able to create a new account for a user who already has an active account.', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'Jackson',
            last_name: 'Douglas',
            email: 'jkdouglas21@gmail.com',
            password: '123123',
        });

        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        await createAccountService.execute({
            user_id: user.id,
            plan_id: plan.id,
        });

        await expect(
            createAccountService.execute({
                user_id: user.id,
                plan_id: plan.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

import FakePlanRepository from '@modules/plans/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeAccountRepository from '../repositories/fakes/FakeAccountRepository';
import ShowAccountService from './ShowAccountService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAccountRepository: FakeAccountRepository;
let fakePlanRepository: FakePlanRepository;

let showAccountService: ShowAccountService;

describe('ShowAccount', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeAccountRepository = new FakeAccountRepository();
        showAccountService = new ShowAccountService(fakeAccountRepository);
    });

    it('should be able to show account', async () => {
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

        const account = await fakeAccountRepository.create({
            user_id: user.id,
            plan_id: plan.id,
        });

        const findAccount = await showAccountService.execute({
            id: account.id,
        });

        expect(findAccount?.user_id).toBe(user.id);
    });

    it('should not be able to show a non-existing account', async () => {
        expect(
            showAccountService.execute({
                id: 'non-existing-user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

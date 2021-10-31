import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import ShowProfileService from './ShowProfileService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();

        showProfileService = new ShowProfileService(fakeAccountsRepository);
    });

    it('should be able to show profile', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
        });

        const profile = await showProfileService.execute({
            account_id: account.id,
        });

        expect(profile.email).toBe('johndoe@example.com');
    });

    it('should not be able to show profile from non-existing account', async () => {
        await expect(
            showProfileService.execute({
                account_id: 'non-existing-account',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

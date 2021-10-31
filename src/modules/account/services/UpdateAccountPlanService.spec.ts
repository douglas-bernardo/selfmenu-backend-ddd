import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import UpdateAccountPlanService from './UpdateAccountPlanService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let updateAccountPlan: UpdateAccountPlanService;

describe('UpdateAccountPlan', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();

        updateAccountPlan = new UpdateAccountPlanService(
            fakeAccountsRepository,
            fakePlanRepository,
        );
    });

    it('should be able to update account plan', async () => {
        const planFree = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const planPremium = await fakePlanRepository.create(
            'Premium',
            'Premium free plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: planFree.id,
        });

        const accountEdited = await updateAccountPlan.execute({
            account_id: account.id,
            plan_id: planPremium.id,
        });

        expect(accountEdited.plan.name).toBe('Premium');
    });
});

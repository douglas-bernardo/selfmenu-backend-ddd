import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import ListAccountsService from './ListAccountsService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let listAccountsService: ListAccountsService;

describe('ListAccountsService', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();

        listAccountsService = new ListAccountsService(fakeAccountsRepository);
    });

    it('should be able to list accounts', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account1 = await fakeAccountsRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
        });

        const account2 = await fakeAccountsRepository.create({
            email: 'johntre@example.com',
            password: '123456',
            profile_name: 'JohnTre',
            plan_id: plan.id,
        });

        const accounts = await listAccountsService.execute();

        expect(accounts).toEqual([account1, account2]);
    });
});

import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeWaiterRepository from '../repositories/fakes/FakeWaiterRepository';
import ListWaitersService from './ListWaitersService';

let fakeAccountRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakePlanRepository: FakePlanRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let listWaitersService: ListWaitersService;

describe('ListWaiters', () => {
    beforeEach(() => {
        fakeAccountRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeWaiterRepository = new FakeWaiterRepository();

        listWaitersService = new ListWaitersService(fakeWaiterRepository);
    });

    it('should be able to list waiters', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const establishment = await fakeEstablishmentRepository.create({
            cnpj: 63655798024,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const waiter1 = await fakeWaiterRepository.create({
            name: 'Moe',
            cpf: 63655798024,
            username: 'moe',
            password: '123123',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        const waiter2 = await fakeWaiterRepository.create({
            name: 'Moe',
            cpf: 63655798024,
            username: 'moe',
            password: '123123',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        const listWaiters = await listWaitersService.execute({
            owner_id: account.id,
        });

        expect(listWaiters).toEqual([waiter1, waiter2]);
    });
});

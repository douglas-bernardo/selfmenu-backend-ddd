import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeEstablishmentRepository from '../repositories/fakes/FakeEstablishmentRepository';
import ListEstablishmentsService from './ListEstablishmentsService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePlanRepository: FakePlanRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let listEstablishmentsService: ListEstablishmentsService;

describe('ListEstablishments', () => {
    beforeEach(() => {
        fakeAccountsRepository = new FakeAccountsRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();

        listEstablishmentsService = new ListEstablishmentsService(
            fakeEstablishmentRepository,
        );
    });

    it('should be able to list establishments associated with owner account', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        account.plan = plan;
        await fakeAccountsRepository.save(account);

        const establishment1 = await fakeEstablishmentRepository.create({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const establishment2 = await fakeEstablishmentRepository.create({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const list = await listEstablishmentsService.execute({
            owner_id: account.id,
        });

        expect(list).toEqual([establishment1, establishment2]);
    });
});

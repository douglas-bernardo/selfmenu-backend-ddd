import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import AppError from '@shared/errors/AppError';
import FakeWaiterRepository from '../repositories/fakes/FakeWaiterRepository';
import ShowWaiterService from './ShowWaiterService';

let fakeAccountRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakePlanRepository: FakePlanRepository;
let fakeWaiterRepository: FakeWaiterRepository;

let showWaiterService: ShowWaiterService;

describe('ShowWaiter', () => {
    beforeEach(() => {
        fakeAccountRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeWaiterRepository = new FakeWaiterRepository();

        showWaiterService = new ShowWaiterService(fakeWaiterRepository);
    });

    it('should be able to show waiter', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const account = await fakeAccountRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        account.plan = plan;
        await fakeAccountRepository.save(account);

        const establishment = await fakeEstablishmentRepository.create({
            cnpj: 63655798024,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        const findWaiter = await showWaiterService.execute({
            id: waiter.id,
            owner_id: account.id,
        });

        expect(findWaiter.name).toBe('Moe');
    });

    it('should not be able to show waiter from non-existing-waiter', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const account = await fakeAccountRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        account.plan = plan;
        await fakeAccountRepository.save(account);

        await expect(
            showWaiterService.execute({
                id: 'non-existing-waiter',
                owner_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

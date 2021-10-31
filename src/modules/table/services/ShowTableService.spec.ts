import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';

import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import AppError from '@shared/errors/AppError';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import ShowTableService from './ShowTableService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeTableRepository: FakeTableRepository;

let showTableService: ShowTableService;

describe('ShowTable', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeTableRepository = new FakeTableRepository();

        showTableService = new ShowTableService(fakeTableRepository);
    });

    it('should be able to show table', async () => {
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
            cnpj: 989865986598,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        const table = await fakeTableRepository.create({
            number: 1,
            capacity: 4,
            establishment,
            waiter,
            owner: account,
        });

        const findTable = await showTableService.execute({
            table_id: table.id,
        });

        expect(findTable.number).toBe(1);
    });

    it('should not be able to show table from non-existing table', async () => {
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

        await fakeEstablishmentRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        await expect(
            showTableService.execute({
                table_id: 'non-existing-table',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import AppError from '@shared/errors/AppError';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import UpdateTableTokenService from './UpdateTableTokenService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakeWaiterRepository: FakeWaiterRepository;

let fakeTableRepository: FakeTableRepository;
let updateTableTokenService: UpdateTableTokenService;

describe('UpdateTableToken', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeTableRepository = new FakeTableRepository();

        updateTableTokenService = new UpdateTableTokenService(
            fakeTableRepository,
        );
    });

    it('should be able to update table token using table number', async () => {
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
            cnpj: 98986598659800,
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

        const tableEdited = await updateTableTokenService.execute({
            establishment_id: establishment.id,
            table_number: table.number,
        });

        expect(tableEdited).not.toBe(null);
    });

    it('should not be able to update table token to non-existing-table', async () => {
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
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        await expect(
            updateTableTokenService.execute({
                establishment_id: establishment.id,
                table_number: 99999,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

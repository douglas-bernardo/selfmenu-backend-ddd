import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';

import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import AppError from '@shared/errors/AppError';
import CreateTableService from './CreateTableService';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';

let fakePlanRepository: FakePlanRepository;
let fakeAccountRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeTableRepository: FakeTableRepository;
let createTableService: CreateTableService;

describe('CreateWaiter', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeTableRepository = new FakeTableRepository();

        createTableService = new CreateTableService(
            fakeAccountRepository,
            fakeEstablishmentRepository,
            fakeTableRepository,
            fakeWaiterRepository,
        );
    });

    it('should be able to create a new table', async () => {
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

        const table = await createTableService.execute({
            capacity: 4,
            establishment_id: establishment.id,
            waiter_id: waiter.id,
            owner_id: account.id,
        });

        expect(table).toHaveProperty('id');
    });

    it('should not be able to create a table with a invalid owner', async () => {
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

        await expect(
            createTableService.execute({
                capacity: 4,
                establishment_id: establishment.id,
                waiter_id: waiter.id,
                owner_id: 'invalid-owner',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a table to invalid establishment', async () => {
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

        await expect(
            createTableService.execute({
                capacity: 4,
                establishment_id: 'invalid-establishment',
                waiter_id: waiter.id,
                owner_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a table to inactive establishment', async () => {
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

        establishment.active = false;
        await fakeEstablishmentRepository.save(establishment);

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        await expect(
            createTableService.execute({
                capacity: 4,
                establishment_id: establishment.id,
                waiter_id: waiter.id,
                owner_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new table to invalid waiter', async () => {
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
            createTableService.execute({
                capacity: 4,
                establishment_id: establishment.id,
                waiter_id: 'invalid-waiter',
                owner_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

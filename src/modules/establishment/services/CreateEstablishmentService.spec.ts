import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeEstablishmentRepository from '../repositories/fakes/FakeEstablishmentRepository';
import CreateEstablishmentService from './CreateEstablishmentService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePlanRepository: FakePlanRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let createEstablishmentService: CreateEstablishmentService;

describe('CreateEstablishment', () => {
    beforeEach(() => {
        fakeAccountsRepository = new FakeAccountsRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();

        createEstablishmentService = new CreateEstablishmentService(
            fakeEstablishmentRepository,
            fakeAccountsRepository,
        );
    });

    it('should be able to create a new establishment associated with his account', async () => {
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

        const establishment = await createEstablishmentService.execute({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            account_id: account.id,
        });

        expect(establishment).toHaveProperty('id');
    });

    it('should not be able to create a menu to non-existing account', async () => {
        await expect(
            createEstablishmentService.execute({
                cnpj: 31132548000119,
                name: "Doe's Dinner",
                description: 'A new establishment',
                establishment_type_id: 1,
                account_id: 'non-existing-account',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a establishment to inactive account', async () => {
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
        account.active = false;
        await fakeAccountsRepository.save(account);

        await expect(
            createEstablishmentService.execute({
                cnpj: 31132548000119,
                name: "Doe's Dinner",
                description: 'A new establishment',
                establishment_type_id: 1,
                account_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create more than one establishment to free account account', async () => {
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

        await createEstablishmentService.execute({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            account_id: account.id,
        });

        await expect(
            createEstablishmentService.execute({
                cnpj: 31132548000119,
                name: "Doe's Café 2",
                description: "A new john's café",
                establishment_type_id: 1,
                account_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

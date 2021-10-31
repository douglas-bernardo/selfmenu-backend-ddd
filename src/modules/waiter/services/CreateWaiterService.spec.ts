import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import FakeHashProvider from '@modules/account/providers/HashProvider/fakes/FakeHashProvider';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import AppError from '@shared/errors/AppError';
import FakeWaiterRepository from '../repositories/fakes/FakeWaiterRepository';
import CreateWaiterService from './CreateWaiterService';

let fakeAccountRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakePlanRepository: FakePlanRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeHashProvider: FakeHashProvider;
let createWaiterService: CreateWaiterService;

describe('CreateWaiter', () => {
    beforeEach(() => {
        fakeAccountRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeHashProvider = new FakeHashProvider();
        createWaiterService = new CreateWaiterService(
            fakeAccountRepository,
            fakeEstablishmentRepository,
            fakeWaiterRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new waiter', async () => {
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

        const waiter = await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        expect(waiter).toHaveProperty('id');
    });

    it('should not be able to create a new waiter with the same cpf code from another', async () => {
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

        await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: account.id,
                establishment_id: establishment.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a waiter with a invalid owner', async () => {
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

        await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: 'invalid-owner',
                establishment_id: establishment.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a waiter to invalid establishment', async () => {
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

        await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: account.id,
                establishment_id: 'invalid-establishment',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a waiter to inactive establishment', async () => {
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

        establishment.active = false;
        await fakeEstablishmentRepository.save(establishment);

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: account.id,
                establishment_id: establishment.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

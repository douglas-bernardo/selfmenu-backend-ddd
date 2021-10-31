import AppError from '@shared/errors/AppError';
import FakeMenuRepository from '@modules/menu/repositories/fakes/FakeMenuRepository';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import CreateMenuService from '@modules/menu/services/CreateMenuService';
import FakeProductRepository from '@modules/product/repositories/fakes/FakeProductRepository';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePlanRepository: FakePlanRepository;
let fakeProductRepository: FakeProductRepository;
let fakeMenuRepository: FakeMenuRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;

let createMenuService: CreateMenuService;

describe('CreateMenu', () => {
    beforeEach(() => {
        fakeAccountsRepository = new FakeAccountsRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeProductRepository = new FakeProductRepository();
        fakeMenuRepository = new FakeMenuRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();

        createMenuService = new CreateMenuService(
            fakeAccountsRepository,
            fakeProductRepository,
            fakeEstablishmentRepository,
            fakeMenuRepository,
        );
    });

    it('should be able to create a new menu', async () => {
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

        const establishment = await fakeEstablishmentRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const menu = await createMenuService.execute({
            title: 'Does Monday Menu',
            description: 'Our best foods',
            account_id: account.id,
            establishment_id: establishment.id,
            products: [
                {
                    id: product.id,
                },
            ],
        });

        expect(menu).toHaveProperty('id');
    });

    it('should not be able to create a menu with a invalid owner', async () => {
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

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                establishment_id: 'non-existing establishment',
                account_id: 'non-existing-owner',
                products: [
                    {
                        id: product.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a menu to non-existing establishment', async () => {
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

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                establishment_id: 'non-existing-establishment',
                account_id: account.id,
                products: [
                    {
                        id: product.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a menu to inactive establishment', async () => {
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

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                account_id: account.id,
                establishment_id: establishment.id,
                products: [
                    {
                        id: product.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new menu with the same title from another', async () => {
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

        const establishment = await fakeEstablishmentRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        await createMenuService.execute({
            title: 'Does Monday Menu',
            description: 'Our best foods',
            account_id: account.id,
            establishment_id: establishment.id,
            products: [
                {
                    id: product.id,
                },
            ],
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                account_id: account.id,
                establishment_id: establishment.id,
                products: [
                    {
                        id: product.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a menu with invalid products', async () => {
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

        const establishment = await fakeEstablishmentRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                account_id: account.id,
                establishment_id: establishment.id,
                products: [
                    {
                        id: 'inexistent-product',
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

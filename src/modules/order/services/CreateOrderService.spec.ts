import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import FakeTableRepository from '@modules/table/repositories/fakes/FakeTableRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import FakeProductRepository from '@modules/product/repositories/fakes/FakeProductRepository';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import UpdateTableTokenService from '@modules/table/services/UpdateTableTokenService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateOrderService from './CreateOrderService';
import FakeOrderRepository from '../repositories/fakes/FakeOrderRepository';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakeTableRepository: FakeTableRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeProductRepository: FakeProductRepository;
let fakeOrderRepository: FakeOrderRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;

let updateTableTokenService: UpdateTableTokenService;
let createOrderService: CreateOrderService;

describe('CreateOrder', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakeTableRepository = new FakeTableRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeProductRepository = new FakeProductRepository();

        fakeOrderRepository = new FakeOrderRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        updateTableTokenService = new UpdateTableTokenService(
            fakeTableRepository,
        );

        createOrderService = new CreateOrderService(
            fakeAccountsRepository,
            fakeEstablishmentRepository,
            fakeTableRepository,
            fakeWaiterRepository,
            fakeProductRepository,
            fakeOrderRepository,
            fakeNotificationsRepository,
        );
    });

    it('should be able to create a new order', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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

        table.establishment = establishment;
        await fakeTableRepository.save(table);

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        const order = await createOrderService.execute({
            owner_id: account.id,
            table_token: token,
            costumer_name: 'fulano',
            establishment_id: establishment.id,
            products: [
                {
                    id: product.id,
                    quantity: 5,
                },
            ],
        });

        expect(order).toHaveProperty('id');
    });

    it('should not be able to create a new order to invalid table', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const account = await fakeAccountsRepository.create({
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

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        await expect(
            createOrderService.execute({
                owner_id: account.id,
                table_token: 'invalid-table',
                costumer_name: 'fulano',
                establishment_id: establishment.id,
                products: [
                    {
                        id: product.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new order to non existing account account', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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

        table.establishment = establishment;
        await fakeTableRepository.save(table);

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        establishment.owner_id = 'non-existing-account-account';
        await fakeEstablishmentRepository.save(establishment);

        await expect(
            createOrderService.execute({
                owner_id: account.id,
                table_token: token,
                costumer_name: 'fulano',
                establishment_id: establishment.id,
                products: [
                    {
                        id: product.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new order to non existing establishment', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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
        table.establishment = establishment;
        await fakeTableRepository.save(table);

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        await fakeTableRepository.save(table);

        await expect(
            createOrderService.execute({
                owner_id: account.id,
                table_token: token,
                costumer_name: 'fulano',
                establishment_id: 'non-existing-establishment',
                products: [
                    {
                        id: product.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new order to invalid waiter', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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
        table.establishment = establishment;
        table.waiter_id = 'invalid-waiter';
        await fakeTableRepository.save(table);

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        await expect(
            createOrderService.execute({
                owner_id: account.id,
                table_token: token,
                costumer_name: 'fulano',
                establishment_id: establishment.id,
                products: [
                    {
                        id: product.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an order with invalid products', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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
        table.establishment = establishment;
        await fakeTableRepository.save(table);

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        await expect(
            createOrderService.execute({
                owner_id: account.id,
                table_token: token,
                costumer_name: 'fulano',
                establishment_id: establishment.id,
                products: [
                    {
                        id: 'invalid-product',
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new order to inexistent products', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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

        table.establishment = establishment;
        await fakeTableRepository.save(table);

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        await expect(
            createOrderService.execute({
                owner_id: account.id,
                table_token: token,
                costumer_name: 'fulano',
                establishment_id: establishment.id,
                products: [
                    {
                        id: product.id,
                        quantity: 5,
                    },
                    {
                        id: 'inexistent-product',
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an order with products with insufficient quantities', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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
        table.establishment = establishment;
        await fakeTableRepository.save(table);

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        await expect(
            createOrderService.execute({
                owner_id: account.id,
                table_token: token,
                costumer_name: 'fulano',
                establishment_id: establishment.id,
                products: [
                    {
                        id: product.id,
                        quantity: 15,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

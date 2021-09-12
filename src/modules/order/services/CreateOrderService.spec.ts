import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import FakeTableRepository from '@modules/table/repositories/fakes/FakeTableRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import FakeItemRepository from '@modules/item/repositories/fakes/FakeItemRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import UpdateTableTokenService from '@modules/table/services/UpdateTableTokenService';
import CreateOrderService from './CreateOrderService';
import FakeOrderRepository from '../repositories/fakes/FakeOrderRepository';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakeTableRepository: FakeTableRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeItemRepository: FakeItemRepository;
let fakeOrderRepository: FakeOrderRepository;

let updateTableTokenService: UpdateTableTokenService;
let createOrderService: CreateOrderService;

describe('CreateOrder', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakeTableRepository = new FakeTableRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeItemRepository = new FakeItemRepository();

        fakeOrderRepository = new FakeOrderRepository();

        updateTableTokenService = new UpdateTableTokenService(
            fakeTableRepository,
        );

        createOrderService = new CreateOrderService(
            fakeUsersRepository,
            fakeRestaurantRepository,
            fakeTableRepository,
            fakeWaiterRepository,
            fakeItemRepository,
            fakeOrderRepository,
        );
    });

    it('should be able to create a new order', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });

        table.restaurant = restaurant;
        await fakeTableRepository.save(table);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        const order = await createOrderService.execute({
            table_token: token,
            items: [
                {
                    id: item.id,
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

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        await expect(
            createOrderService.execute({
                table_token: 'invalid-table',
                items: [
                    {
                        id: item.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new order to non existing user account', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });

        table.restaurant = restaurant;
        await fakeTableRepository.save(table);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        restaurant.owner_id = 'non-existing-user-account';
        await fakeRestaurantRepository.save(restaurant);

        await expect(
            createOrderService.execute({
                table_token: token,
                items: [
                    {
                        id: item.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new order to non existing restaurant', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });
        table.restaurant = restaurant;
        await fakeTableRepository.save(table);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        table.restaurant_id = 'non-existing-restaurant';
        await fakeTableRepository.save(table);

        await expect(
            createOrderService.execute({
                table_token: token,
                items: [
                    {
                        id: item.id,
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

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });
        table.restaurant = restaurant;
        table.waiter_id = 'invalid-waiter';
        await fakeTableRepository.save(table);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        await expect(
            createOrderService.execute({
                table_token: token,
                items: [
                    {
                        id: item.id,
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

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });
        table.restaurant = restaurant;
        await fakeTableRepository.save(table);

        const { token } = await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        await expect(
            createOrderService.execute({
                table_token: token,
                items: [
                    {
                        id: 'invalid-item',
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new order to inexistent items', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });

        table.restaurant = restaurant;
        await fakeTableRepository.save(table);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        await expect(
            createOrderService.execute({
                table_token: token,
                items: [
                    {
                        id: item.id,
                        quantity: 5,
                    },
                    {
                        id: 'inexistent-item',
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

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });
        table.restaurant = restaurant;
        await fakeTableRepository.save(table);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        await expect(
            createOrderService.execute({
                table_token: token,
                items: [
                    {
                        id: item.id,
                        quantity: 15,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import FakeTableRepository from '@modules/table/repositories/fakes/FakeTableRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import FakeItemRepository from '@modules/item/repositories/fakes/FakeItemRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
// import FakeMenuRepository from '@modules/menu/repositories/fakes/FakeMenuRepository';
import AppError from '@shared/errors/AppError';
import CreateOrderService from './CreateOrderService';
import FakeOrderRepository from '../repositories/fakes/FakeOrderRepository';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakeTableRepository: FakeTableRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeItemRepository: FakeItemRepository;
// let fakeMenuRepository: FakeMenuRepository;
let fakeOrderRepository: FakeOrderRepository;

let createOrderService: CreateOrderService;

describe('CreateOrder', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakeTableRepository = new FakeTableRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeItemRepository = new FakeItemRepository();
        // fakeMenuRepository = new FakeMenuRepository();

        fakeOrderRepository = new FakeOrderRepository();

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

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const order = await createOrderService.execute({
            owner_id: user.id,
            restaurant_id: restaurant.id,
            table_id: table.id,
            waiter_id: waiter.id,
            items: [
                {
                    id: item.id,
                    quantity: 5,
                },
            ],
        });

        expect(order).toHaveProperty('id');
    });

    it('should not be able to create a new order to non existing user', async () => {
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
                owner_id: 'non-existing-user',
                restaurant_id: restaurant.id,
                table_id: table.id,
                waiter_id: waiter.id,
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
                owner_id: user.id,
                restaurant_id: 'non-existing-restaurant',
                table_id: table.id,
                waiter_id: waiter.id,
                items: [
                    {
                        id: item.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
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
                owner_id: user.id,
                restaurant_id: restaurant.id,
                table_id: 'invalid-table',
                waiter_id: waiter.id,
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
                owner_id: user.id,
                restaurant_id: restaurant.id,
                table_id: table.id,
                waiter_id: 'invalid-waiter.id',
                items: [
                    {
                        id: item.id,
                        quantity: 5,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

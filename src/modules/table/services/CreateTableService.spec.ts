import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';

import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import AppError from '@shared/errors/AppError';
import CreateTableService from './CreateTableService';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';

let fakePlanRepository: FakePlanRepository;
let fakeUserRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeTableRepository: FakeTableRepository;
let createTableService: CreateTableService;

describe('CreateWaiter', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUserRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeTableRepository = new FakeTableRepository();

        createTableService = new CreateTableService(
            fakeUserRepository,
            fakeRestaurantRepository,
            fakeTableRepository,
            fakeWaiterRepository,
        );
    });

    it('should be able to create a new table', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await createTableService.execute({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
            owner_id: user.id,
        });

        expect(table).toHaveProperty('id');
    });

    it('should not be able to create a table with a invalid owner', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        await expect(
            createTableService.execute({
                code: 'T001',
                capacity: 4,
                restaurant_id: restaurant.id,
                waiter_id: waiter.id,
                owner_id: 'invalid-owner',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a table to invalid restaurant', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        await expect(
            createTableService.execute({
                code: 'T001',
                capacity: 4,
                restaurant_id: 'invalid-restaurant',
                waiter_id: waiter.id,
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a table to inactive restaurant', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        restaurant.active = false;
        await fakeRestaurantRepository.save(restaurant);

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        await expect(
            createTableService.execute({
                code: 'T001',
                capacity: 4,
                restaurant_id: restaurant.id,
                waiter_id: waiter.id,
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new table with same code from another', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        await createTableService.execute({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
            owner_id: user.id,
        });

        await expect(
            createTableService.execute({
                code: 'T001',
                capacity: 4,
                restaurant_id: restaurant.id,
                waiter_id: waiter.id,
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new table to invalid waiter', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        await expect(
            createTableService.execute({
                code: 'T001',
                capacity: 4,
                restaurant_id: restaurant.id,
                waiter_id: 'invalid-waiter',
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

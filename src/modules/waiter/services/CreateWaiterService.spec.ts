import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeWaiterRepository from '../repositories/fakes/FakeWaiterRepository';
import CreateWaiterService from './CreateWaiterService';

let fakeUserRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakePlanRepository: FakePlanRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeHashProvider: FakeHashProvider;
let createWaiterService: CreateWaiterService;

describe('CreateWaiter', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeHashProvider = new FakeHashProvider();
        createWaiterService = new CreateWaiterService(
            fakeUserRepository,
            fakeRestaurantRepository,
            fakeWaiterRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new waiter', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUserRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 63655798024,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        expect(waiter).toHaveProperty('id');
    });

    it('should not be able to create a new waiter with the same cpf code from another', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUserRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 63655798024,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: user.id,
                restaurant_id: restaurant.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a waiter with a invalid owner', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUserRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 63655798024,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: 'invalid-owner',
                restaurant_id: restaurant.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a waiter to invalid restaurant', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUserRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 63655798024,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        await createWaiterService.execute({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: user.id,
                restaurant_id: 'invalid-restaurant',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a waiter to inactive restaurant', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const user = await fakeUserRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUserRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 63655798024,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        restaurant.active = false;
        await fakeRestaurantRepository.save(restaurant);

        await expect(
            createWaiterService.execute({
                name: 'Moe',
                username: 'moe',
                cpf: 63655798024,
                password: '123456',
                owner_id: user.id,
                restaurant_id: restaurant.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

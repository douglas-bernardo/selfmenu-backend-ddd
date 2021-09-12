import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '../repositories/fakes/FakeRestaurantRepository';
import CreateRestaurantService from './CreateRestaurantService';

let fakeUsersRepository: FakeUsersRepository;
let fakePlanRepository: FakePlanRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let createRestaurantService: CreateRestaurantService;

describe('CreateRestaurant', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();

        createRestaurantService = new CreateRestaurantService(
            fakeRestaurantRepository,
            fakeUsersRepository,
        );
    });

    it('should be able to create a new restaurant associated with his account', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await createRestaurantService.execute({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            user_id: user.id,
        });

        expect(restaurant).toHaveProperty('id');
    });

    it('should not be able to create a menu to non-existing user', async () => {
        await expect(
            createRestaurantService.execute({
                cnpj: 31132548000119,
                name: "Doe's Dinner",
                description: 'A new restaurant',
                restaurant_type_id: 1,
                user_id: 'non-existing-user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a restaurant to inactive user', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.active = false;
        await fakeUsersRepository.save(user);

        await expect(
            createRestaurantService.execute({
                cnpj: 31132548000119,
                name: "Doe's Dinner",
                description: 'A new restaurant',
                restaurant_type_id: 1,
                user_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create more than one restaurant to free user account', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const user = await fakeUsersRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        user.plan = plan;
        await fakeUsersRepository.save(user);

        await createRestaurantService.execute({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            user_id: user.id,
        });

        await expect(
            createRestaurantService.execute({
                cnpj: 31132548000119,
                name: "Doe's Café 2",
                description: "A new john's café",
                restaurant_type_id: 1,
                user_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

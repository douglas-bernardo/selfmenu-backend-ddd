import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '../repositories/fakes/FakeRestaurantRepository';
import ShowRestaurantService from './ShowRestaurantService';

let fakeUsersRepository: FakeUsersRepository;
let fakePlanRepository: FakePlanRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;

let showRestaurantService: ShowRestaurantService;

describe('ShowRestaurant', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();

        showRestaurantService = new ShowRestaurantService(
            fakeUsersRepository,
            fakeRestaurantRepository,
        );
    });

    it('should be able to show restaurant details', async () => {
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

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'doe-dinner',
        });

        const findRestaurant = await showRestaurantService.execute({
            id: restaurant.id,
            owner_id: user.id,
        });

        expect(findRestaurant.cnpj).toBe('989865986598');
    });

    it('should not be able to show restaurant from non-existing account', async () => {
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

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'doe-dinner',
        });

        expect(
            showRestaurantService.execute({
                id: restaurant.id,
                owner_id: 'non-existing-account',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to show restaurant from non-existing-restaurant', async () => {
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

        expect(
            showRestaurantService.execute({
                id: 'non-existing-restaurant',
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

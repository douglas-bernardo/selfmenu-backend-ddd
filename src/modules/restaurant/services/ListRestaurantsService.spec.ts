import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '../repositories/fakes/FakeRestaurantRepository';
import ListRestaurantsService from './ListRestaurantsService';

let fakeUsersRepository: FakeUsersRepository;
let fakePlanRepository: FakePlanRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let listRestaurantsService: ListRestaurantsService;

describe('ListRestaurants', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();

        listRestaurantsService = new ListRestaurantsService(
            fakeRestaurantRepository,
        );
    });

    it('should be able to list restaurants associated with owner account', async () => {
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

        const restaurant1 = await fakeRestaurantRepository.create({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const restaurant2 = await fakeRestaurantRepository.create({
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const list = await listRestaurantsService.execute({
            owner_id: user.id,
        });

        expect(list).toEqual([restaurant1, restaurant2]);
    });
});

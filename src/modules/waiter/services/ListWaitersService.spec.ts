import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeWaiterRepository from '../repositories/fakes/FakeWaiterRepository';
import ListWaitersService from './ListWaitersService';

let fakeUserRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakePlanRepository: FakePlanRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let listWaitersService: ListWaitersService;

describe('ListWaiters', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeWaiterRepository = new FakeWaiterRepository();

        listWaitersService = new ListWaitersService(fakeWaiterRepository);
    });

    it('should be able to list waiters', async () => {
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
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter1 = await fakeWaiterRepository.create({
            name: 'Moe',
            cpf: '999.888.999-88',
            username: 'moe',
            password: '123123',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const waiter2 = await fakeWaiterRepository.create({
            name: 'Moe',
            cpf: '999.888.999-99',
            username: 'moe',
            password: '123123',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const listWaiters = await listWaitersService.execute({
            owner_id: user.id,
        });

        expect(listWaiters).toEqual([waiter1, waiter2]);
    });
});

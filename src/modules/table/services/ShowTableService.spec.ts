import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';

import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import AppError from '@shared/errors/AppError';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import ShowTableService from './ShowTableService';

let fakePlanRepository: FakePlanRepository;
let fakeUserRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeTableRepository: FakeTableRepository;

let showTableService: ShowTableService;

describe('ShowTable', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUserRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeTableRepository = new FakeTableRepository();

        showTableService = new ShowTableService(fakeTableRepository);
    });

    it('should be able to show table', async () => {
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

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T0001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });

        const findTable = await showTableService.execute({
            id: table.id,
            restaurant_id: restaurant.id,
        });

        expect(findTable.code).toBe('T0001');
    });

    it('should not be able to show table from non-existing table', async () => {
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

        await expect(
            showTableService.execute({
                id: 'non-existing-table',
                restaurant_id: restaurant.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

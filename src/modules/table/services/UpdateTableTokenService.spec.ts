import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import AppError from '@shared/errors/AppError';
import FakeTableRepository from '../repositories/fakes/FakeTableRepository';
import UpdateTableTokenService from './UpdateTableTokenService';

let fakePlanRepository: FakePlanRepository;
let fakeUserRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakeWaiterRepository: FakeWaiterRepository;

let fakeTableRepository: FakeTableRepository;
let updateTableTokenService: UpdateTableTokenService;

describe('UpdateTableToken', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUserRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeTableRepository = new FakeTableRepository();

        updateTableTokenService = new UpdateTableTokenService(
            fakeTableRepository,
        );
    });

    it('should be able to update table token using table code', async () => {
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
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });

        const tableEdited = await updateTableTokenService.execute({
            restaurant_id: restaurant.id,
            table_code: table.code,
        });

        expect(tableEdited).not.toBe(null);
    });

    it('should not be able to update table token to non-existing-table', async () => {
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
            updateTableTokenService.execute({
                restaurant_id: restaurant.id,
                table_code: 'non-existing-table',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

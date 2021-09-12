import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeWaiterRepository from '../repositories/fakes/FakeWaiterRepository';
import ShowWaiterService from './ShowWaiterService';

let fakeUserRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakePlanRepository: FakePlanRepository;
let fakeWaiterRepository: FakeWaiterRepository;

let showWaiterService: ShowWaiterService;

describe('ShowWaiter', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeWaiterRepository = new FakeWaiterRepository();

        showWaiterService = new ShowWaiterService(fakeWaiterRepository);
    });

    it('should be able to show waiter', async () => {
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

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 63655798024,
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const findWaiter = await showWaiterService.execute({
            id: waiter.id,
            owner_id: user.id,
        });

        expect(findWaiter.name).toBe('Moe');
    });

    it('should not be able to show waiter from non-existing-waiter', async () => {
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

        await expect(
            showWaiterService.execute({
                id: 'non-existing-waiter',
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

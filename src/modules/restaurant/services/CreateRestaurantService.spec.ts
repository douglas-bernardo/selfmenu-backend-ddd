import AppError from '@shared/errors/AppError';
import FakeAccountRepository from '@modules/accounts/repositories/fakes/FakeAccountRepository';
import FakePlanRepository from '@modules/plans/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '../repositories/fakes/FakeRestaurantRepository';
import CreateRestaurantService from './CreateRestaurantService';

let fakeUsersRepository: FakeUsersRepository;
let fakePlanRepository: FakePlanRepository;
let fakeAccountRepository: FakeAccountRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let createRestaurantService: CreateRestaurantService;

describe('CreateRestaurant', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeAccountRepository = new FakeAccountRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();

        createRestaurantService = new CreateRestaurantService(
            fakeRestaurantRepository,
            fakeAccountRepository,
        );
    });

    it('should be able to create a new restaurant associated with his account', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@gmail.com',
            password: '123123',
        });

        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountRepository.create({
            user_id: user.id,
            plan_id: plan.id,
        });
        account.plan = plan;
        await fakeAccountRepository.save(account);

        const restaurant = await createRestaurantService.execute({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            account_id: account.id,
        });

        expect(restaurant).toHaveProperty('id');
    });

    it('should not be able to create a restaurant to inactive accounts', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@gmail.com',
            password: '123123',
        });

        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountRepository.create({
            user_id: user.id,
            plan_id: plan.id,
        });

        account.active = false;
        await fakeAccountRepository.save(account);

        await expect(
            createRestaurantService.execute({
                cnpj: '989865986598',
                name: "Doe's Dinner",
                description: 'A new restaurant',
                restaurant_type_id: 1,
                account_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create more than one restaurant to free account', async () => {
        const user = await fakeUsersRepository.create({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@gmail.com',
            password: '123123',
        });

        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountRepository.create({
            user_id: user.id,
            plan_id: plan.id,
        });
        account.plan = plan;
        await fakeAccountRepository.save(account);

        await createRestaurantService.execute({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            account_id: account.id,
        });

        await expect(
            createRestaurantService.execute({
                cnpj: '7856985698569',
                name: "Doe's Café",
                description: "A new john's café",
                restaurant_type_id: 1,
                account_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

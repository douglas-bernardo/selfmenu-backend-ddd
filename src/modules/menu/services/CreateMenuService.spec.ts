import AppError from '@shared/errors/AppError';
import FakeMenuRepository from '@modules/menu/repositories/fakes/FakeMenuRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import CreateMenuService from '@modules/menu/services/CreateMenuService';
import FakeItemRepository from '@modules/item/repositories/fakes/FakeItemRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakePlanRepository: FakePlanRepository;
let fakeItemRepository: FakeItemRepository;
let fakeMenuRepository: FakeMenuRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;

let createMenuService: CreateMenuService;

describe('CreateMenu', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeItemRepository = new FakeItemRepository();
        fakeMenuRepository = new FakeMenuRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();

        createMenuService = new CreateMenuService(
            fakeUsersRepository,
            fakeItemRepository,
            fakeRestaurantRepository,
            fakeMenuRepository,
        );
    });

    it('should be able to create a new menu', async () => {
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

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        const menu = await createMenuService.execute({
            title: 'Does Monday Menu',
            description: 'Our best foods',
            user_id: user.id,
            restaurant_id: restaurant.id,
            items: [
                {
                    id: item.id,
                },
            ],
        });

        expect(menu).toHaveProperty('id');
    });

    it('should not be able to create a menu with a invalid owner', async () => {
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

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                restaurant_id: 'non-existing restaurant',
                user_id: 'non-existing-owner',
                items: [
                    {
                        id: item.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a menu to non-existing restaurant', async () => {
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

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                restaurant_id: 'non-existing-restaurant',
                user_id: user.id,
                items: [
                    {
                        id: item.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a menu to inactive restaurant', async () => {
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

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        restaurant.active = false;
        await fakeRestaurantRepository.save(restaurant);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                user_id: user.id,
                restaurant_id: restaurant.id,
                items: [
                    {
                        id: item.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new menu with the same title from another', async () => {
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

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        await createMenuService.execute({
            title: 'Does Monday Menu',
            description: 'Our best foods',
            user_id: user.id,
            restaurant_id: restaurant.id,
            items: [
                {
                    id: item.id,
                },
            ],
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                user_id: user.id,
                restaurant_id: restaurant.id,
                items: [
                    {
                        id: item.id,
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a menu with invalid items', async () => {
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

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        await expect(
            createMenuService.execute({
                title: 'Does Monday Menu',
                description: 'Our best foods',
                user_id: user.id,
                restaurant_id: restaurant.id,
                items: [
                    {
                        id: 'inexistent-item',
                    },
                ],
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

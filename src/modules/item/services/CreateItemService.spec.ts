import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeItemRepository from '../repositories/fakes/FakeItemRepository';
import CreateItemService from './CreateItemService';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCategoryRepository: FakeCategoryRepository;
let fakeItemRepository: FakeItemRepository;

let createItemService: CreateItemService;

describe('CreateItem', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        fakeCategoryRepository = new FakeCategoryRepository();
        fakeItemRepository = new FakeItemRepository();

        createItemService = new CreateItemService(
            fakeUsersRepository,
            fakeItemRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to create a new item', async () => {
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

        const category = await fakeCategoryRepository.create({
            name: 'Bolos',
            owner: user,
        });

        const item = await createItemService.execute({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            user_id: user.id,
        });

        expect(item).toHaveProperty('id');
    });

    it('should not be able to create a item to non-existing user', async () => {
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

        const category = await fakeCategoryRepository.create({
            name: 'Bolos',
            owner: user,
        });

        await expect(
            createItemService.execute({
                name: 'Cake Chocolate',
                description: 'Delicious Cake',
                price: 19.9,
                quantity: 10,
                category_id: category.id,
                user_id: 'non-existing user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new item for inactive user', async () => {
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

        const category = await fakeCategoryRepository.create({
            name: 'Bolos',
            owner: user,
        });

        await expect(
            createItemService.execute({
                name: 'Cake Chocolate',
                description: 'Delicious Cake',
                price: 19.9,
                quantity: 10,
                category_id: category.id,
                user_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new item with same name from other', async () => {
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

        const category = await fakeCategoryRepository.create({
            name: 'Bolos',
            owner: user,
        });

        await createItemService.execute({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            user_id: user.id,
        });

        await expect(
            createItemService.execute({
                name: 'Cake Chocolate',
                description: 'Delicious Cake',
                price: 19.9,
                quantity: 10,
                category_id: category.id,
                user_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

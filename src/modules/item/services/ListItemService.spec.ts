import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeItemRepository from '../repositories/fakes/FakeItemRepository';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';
import ListItemsService from './ListItemsService';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCategoryRepository: FakeCategoryRepository;
let fakeItemRepository: FakeItemRepository;
let fakeCacheProvider: FakeCacheProvider;

let listItemsService: ListItemsService;

describe('ListItems', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeCategoryRepository = new FakeCategoryRepository();
        fakeItemRepository = new FakeItemRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listItemsService = new ListItemsService(
            fakeItemRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list items', async () => {
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
            name: 'Sobremesas',
            owner: user,
        });

        const item1 = await fakeItemRepository.create({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            owner_id: user.id,
        });

        const item2 = await fakeItemRepository.create({
            name: 'Vanilla ice cream',
            description: 'Delicious Vanilla ice cream',
            price: 39.9,
            quantity: 10,
            category_id: category.id,
            owner_id: user.id,
        });

        const list = await listItemsService.execute({
            owner_id: user.id,
            category_id: category.id,
        });

        expect(list).toEqual([item1, item2]);
    });
});

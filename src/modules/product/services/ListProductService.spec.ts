import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';
import ListProductsService from './ListProductService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeCategoryRepository: FakeCategoryRepository;
let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;

let listProductsService: ListProductsService;

describe('ListProducts', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeCategoryRepository = new FakeCategoryRepository();
        fakeProductRepository = new FakeProductRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProductsService = new ListProductsService(
            fakeProductRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list products', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });

        const category = await fakeCategoryRepository.create({
            name: 'Sobremesas',
            owner: account,
        });

        const product1 = await fakeProductRepository.create({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            owner_id: account.id,
        });

        const product2 = await fakeProductRepository.create({
            name: 'Vanilla ice cream',
            description: 'Delicious Vanilla ice cream',
            price: 39.9,
            quantity: 10,
            category_id: category.id,
            owner_id: account.id,
        });

        const list = await listProductsService.execute({
            owner_id: account.id,
            category_id: category.id,
        });

        expect(list).toEqual([product1, product2]);
    });
});

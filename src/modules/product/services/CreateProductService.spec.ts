import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import CreateProductService from './CreateProductService';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCategoryRepository: FakeCategoryRepository;
let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;

let createProductService: CreateProductService;

describe('CreateProduct', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeStorageProvider = new FakeStorageProvider();

        fakeCategoryRepository = new FakeCategoryRepository();
        fakeProductRepository = new FakeProductRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createProductService = new CreateProductService(
            fakeAccountsRepository,
            fakeProductRepository,
            fakeStorageProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new product', async () => {
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
            name: 'Bolos',
            owner: account,
        });

        const product = await createProductService.execute({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            account_id: account.id,
        });

        expect(product).toHaveProperty('id');
    });

    it('should not be able to create a product to non-existing account', async () => {
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
            name: 'Bolos',
            owner: account,
        });

        await expect(
            createProductService.execute({
                name: 'Cake Chocolate',
                description: 'Delicious Cake',
                price: 19.9,
                quantity: 10,
                category_id: category.id,
                account_id: 'non-existing account',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new product for inactive account', async () => {
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
        account.active = false;
        await fakeAccountsRepository.save(account);

        const category = await fakeCategoryRepository.create({
            name: 'Bolos',
            owner: account,
        });

        await expect(
            createProductService.execute({
                name: 'Cake Chocolate',
                description: 'Delicious Cake',
                price: 19.9,
                quantity: 10,
                category_id: category.id,
                account_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new product with same name from other', async () => {
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
            name: 'Bolos',
            owner: account,
        });

        await createProductService.execute({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            account_id: account.id,
        });

        await expect(
            createProductService.execute({
                name: 'Cake Chocolate',
                description: 'Delicious Cake',
                price: 19.9,
                quantity: 10,
                category_id: category.id,
                account_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';
import ShowProductService from './ShowProductService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeCategoryRepository: FakeCategoryRepository;
let fakeProductRepository: FakeProductRepository;

let showProductService: ShowProductService;

describe('ShowProduct', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();

        fakeCategoryRepository = new FakeCategoryRepository();
        fakeProductRepository = new FakeProductRepository();

        showProductService = new ShowProductService(fakeProductRepository);
    });

    it('should be able to show product', async () => {
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

        const product = await fakeProductRepository.create({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            owner_id: account.id,
        });

        const findProduct = await showProductService.execute({
            product_id: product.id,
            owner_id: account.id,
        });

        expect(findProduct.name).toBe('Cake Chocolate');
    });

    it('should not be able to show product from a non-existing-product', async () => {
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

        await expect(
            showProductService.execute({
                product_id: 'non-existing-product',
                owner_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

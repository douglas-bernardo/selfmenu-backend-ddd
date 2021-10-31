import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';
import CreateCategoryService from './CreateCategoryService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeCategoryRepository: FakeCategoryRepository;

let fakeStorageProvider: FakeStorageProvider;
let createCategoryService: CreateCategoryService;

describe('CreateCategory', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeCategoryRepository = new FakeCategoryRepository();
        fakeStorageProvider = new FakeStorageProvider();

        createCategoryService = new CreateCategoryService(
            fakeAccountsRepository,
            fakeCategoryRepository,
            fakeStorageProvider,
        );
    });

    it('should be able to create a new category', async () => {
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

        const category = await createCategoryService.execute({
            name: 'Fast Food',
            owner_id: account.id,
        });

        expect(category).toHaveProperty('id');
    });

    it('should not be able to create a new category from non-existing-account', async () => {
        await expect(
            createCategoryService.execute({
                name: 'Fast Food',
                owner_id: 'non-existing-account',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new category with same name from another', async () => {
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

        await createCategoryService.execute({
            name: 'Fast Food',
            owner_id: account.id,
        });

        await expect(
            createCategoryService.execute({
                name: 'Fast Food',
                owner_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

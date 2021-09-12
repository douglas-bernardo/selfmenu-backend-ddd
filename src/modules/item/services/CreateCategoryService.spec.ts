import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';
import CreateCategoryService from './CreateCategoryService';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCategoryRepository: FakeCategoryRepository;

let createCategoryService: CreateCategoryService;

describe('CreateCategory', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeCategoryRepository = new FakeCategoryRepository();

        createCategoryService = new CreateCategoryService(
            fakeUsersRepository,
            fakeCategoryRepository,
        );
    });

    it('should be able to create a new category', async () => {
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

        const category = await createCategoryService.execute({
            name: 'Fast Food',
            owner_id: user.id,
        });

        expect(category).toHaveProperty('id');
    });

    it('should not be able to create a new category from non-existing-user', async () => {
        await expect(
            createCategoryService.execute({
                name: 'Fast Food',
                owner_id: 'non-existing-user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a new category with same name from another', async () => {
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

        await createCategoryService.execute({
            name: 'Fast Food',
            owner_id: user.id,
        });

        await expect(
            createCategoryService.execute({
                name: 'Fast Food',
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

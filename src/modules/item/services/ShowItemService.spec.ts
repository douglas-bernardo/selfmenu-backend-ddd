import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeItemRepository from '../repositories/fakes/FakeItemRepository';
import FakeCategoryRepository from '../repositories/fakes/FakeCategoryRepository';
import ShowItemService from './ShowItemService';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCategoryRepository: FakeCategoryRepository;
let fakeItemRepository: FakeItemRepository;

let showItemService: ShowItemService;

describe('ShowItem', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();

        fakeCategoryRepository = new FakeCategoryRepository();
        fakeItemRepository = new FakeItemRepository();

        showItemService = new ShowItemService(fakeItemRepository);
    });

    it('should be able to show item', async () => {
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

        const category = await fakeCategoryRepository.create('Bolos', user.id);

        const item = await fakeItemRepository.create({
            name: 'Cake Chocolate',
            description: 'Delicious Cake',
            price: 19.9,
            quantity: 10,
            category_id: category.id,
            owner_id: user.id,
        });

        const findItem = await showItemService.execute({
            item_id: item.id,
            owner_id: user.id,
        });

        expect(findItem.name).toBe('Cake Chocolate');
    });

    it('should not be able to show item from a non-existing-item', async () => {
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

        await expect(
            showItemService.execute({
                item_id: 'non-existing-item',
                owner_id: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

import FakeMenuRepository from '@modules/menu/repositories/fakes/FakeMenuRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import ListMenuService from '@modules/menu/services/ListMenuService';
import FakeItemRepository from '@modules/item/repositories/fakes/FakeItemRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakePlanRepository: FakePlanRepository;
let fakeItemRepository: FakeItemRepository;
let fakeMenuRepository: FakeMenuRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;

let listMenuService: ListMenuService;

describe('ListMenu', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeItemRepository = new FakeItemRepository();
        fakeMenuRepository = new FakeMenuRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();

        listMenuService = new ListMenuService(fakeMenuRepository);
    });

    it('should be able to list menus', async () => {
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
        user.plan = plan;
        await fakeUsersRepository.save(user);

        const restaurant = await fakeRestaurantRepository.create({
            cnpj: 98986598659800,
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

        const menu1 = await fakeMenuRepository.create({
            title: 'Does Monday Menu',
            description: 'Our best foods Monday',
            owner: user,
            restaurant,
            items: [
                {
                    item_id: item.id,
                },
            ],
        });

        const menu2 = await fakeMenuRepository.create({
            title: 'Does Tuesday Menu',
            description: 'Our best foods Tuesday',
            owner: user,
            restaurant,
            items: [
                {
                    item_id: item.id,
                },
            ],
        });

        const list = await listMenuService.execute({ user_id: user.id });

        expect(list).toEqual([menu1, menu2]);
    });
});

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeRestaurantRepository from '@modules/restaurant/repositories/fakes/FakeRestaurantRepository';
import FakeTableRepository from '@modules/table/repositories/fakes/FakeTableRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import FakeItemRepository from '@modules/item/repositories/fakes/FakeItemRepository';
import FakePlanRepository from '@modules/users/repositories/fakes/FakePlanRepository';
import UpdateTableTokenService from '@modules/table/services/UpdateTableTokenService';
import ShowOrderService from './ShowOrderService';
import FakeOrderRepository from '../repositories/fakes/FakeOrderRepository';

let fakePlanRepository: FakePlanRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeRestaurantRepository: FakeRestaurantRepository;
let fakeTableRepository: FakeTableRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeItemRepository: FakeItemRepository;
let fakeOrderRepository: FakeOrderRepository;

let updateTableTokenService: UpdateTableTokenService;
let showOrderService: ShowOrderService;

describe('ShowOrder', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeUsersRepository = new FakeUsersRepository();
        fakeRestaurantRepository = new FakeRestaurantRepository();
        fakeTableRepository = new FakeTableRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeItemRepository = new FakeItemRepository();

        fakeOrderRepository = new FakeOrderRepository();

        updateTableTokenService = new UpdateTableTokenService(
            fakeTableRepository,
        );

        showOrderService = new ShowOrderService(fakeOrderRepository);
    });

    it('should be able to show a order', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
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
            cnpj: '989865986598',
            name: "Doe's Dinner",
            description: 'A new restaurant',
            restaurant_type_id: 1,
            owner_id: user.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: '999.999.999-99',
            password: '123456',
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        const table = await fakeTableRepository.create({
            code: 'T001',
            capacity: 4,
            restaurant_id: restaurant.id,
            waiter_id: waiter.id,
        });

        table.restaurant = restaurant;
        await fakeTableRepository.save(table);

        const item = await fakeItemRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: user.id,
        });

        await updateTableTokenService.execute({
            table_code: table.code,
            restaurant_id: restaurant.id,
        });

        const order = await fakeOrderRepository.create({
            status_order_id: 1,
            waiter,
            restaurant,
            table,
            items: [
                {
                    item_id: item.id,
                    quantity: 5,
                    price: 10.9,
                },
            ],
        });

        const findOrder = await showOrderService.execute({ id: order.id });

        expect(findOrder.status_order_id).toBe(1);
    });
});

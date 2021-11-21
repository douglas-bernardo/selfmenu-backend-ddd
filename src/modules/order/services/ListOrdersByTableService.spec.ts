import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import FakeTableRepository from '@modules/table/repositories/fakes/FakeTableRepository';
import FakeWaiterRepository from '@modules/waiter/repositories/fakes/FakeWaiterRepository';
import FakeProductRepository from '@modules/product/repositories/fakes/FakeProductRepository';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import UpdateTableTokenService from '@modules/table/services/UpdateTableTokenService';
import FakeOrderRepository from '../repositories/fakes/FakeOrderRepository';
import ListOrdersService from './ListOrdersByTableService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;
let fakeTableRepository: FakeTableRepository;
let fakeWaiterRepository: FakeWaiterRepository;
let fakeProductRepository: FakeProductRepository;
let fakeOrderRepository: FakeOrderRepository;

let updateTableTokenService: UpdateTableTokenService;
let listOrdersService: ListOrdersService;

describe('ListOrders', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();
        fakeTableRepository = new FakeTableRepository();
        fakeWaiterRepository = new FakeWaiterRepository();
        fakeProductRepository = new FakeProductRepository();

        fakeOrderRepository = new FakeOrderRepository();

        updateTableTokenService = new UpdateTableTokenService(
            fakeTableRepository,
        );

        listOrdersService = new ListOrdersService(fakeOrderRepository);
    });

    it('should be able to list orders', async () => {
        const plan = await fakePlanRepository.create(
            'Premium',
            'Selfmenu premium plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
            plan_id: plan.id,
        });
        account.plan = plan;
        await fakeAccountsRepository.save(account);

        const establishment = await fakeEstablishmentRepository.create({
            cnpj: 989865986598,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const waiter = await fakeWaiterRepository.create({
            name: 'Moe',
            username: 'moe',
            cpf: 99999999999,
            password: '123456',
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        const table = await fakeTableRepository.create({
            number: 1,
            capacity: 4,
            establishment,
            waiter,
            owner: account,
        });

        table.establishment = establishment;
        await fakeTableRepository.save(table);

        const product = await fakeProductRepository.create({
            name: 'Chocolate Cake',
            description: 'Delicious Chocolate Cake',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const { token } = await updateTableTokenService.execute({
            table_number: table.number,
            establishment_id: establishment.id,
        });

        const order1 = await fakeOrderRepository.create({
            table_token: token,
            establishment,
            table,
            customer_name: 'fulano',
            waiter,
            status_order_id: 1,
            owner: account,
            products: [
                {
                    product_id: product.id,
                    quantity: 1,
                    price: 10.99,
                },
            ],
        });

        const order2 = await fakeOrderRepository.create({
            table_token: token,
            establishment,
            table,
            customer_name: 'fulano',
            waiter,
            status_order_id: 1,
            owner: account,
            products: [
                {
                    product_id: product.id,
                    quantity: 1,
                    price: 10.99,
                },
            ],
        });

        const list = await listOrdersService.execute({
            owner_id: account.id,
            table_id: table.id,
        });

        expect(list).toEqual([order1, order2]);
    });
});

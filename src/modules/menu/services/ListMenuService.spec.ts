import FakeMenuRepository from '@modules/menu/repositories/fakes/FakeMenuRepository';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeEstablishmentRepository from '@modules/establishment/repositories/fakes/FakeEstablishmentRepository';
import ListMenuService from '@modules/menu/services/ListMenuService';
import FakeProductRepository from '@modules/product/repositories/fakes/FakeProductRepository';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePlanRepository: FakePlanRepository;
let fakeProductRepository: FakeProductRepository;
let fakeMenuRepository: FakeMenuRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;

let listMenuService: ListMenuService;

describe('ListMenu', () => {
    beforeEach(() => {
        fakeAccountsRepository = new FakeAccountsRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeProductRepository = new FakeProductRepository();
        fakeMenuRepository = new FakeMenuRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();

        listMenuService = new ListMenuService(fakeMenuRepository);
    });

    it('should be able to list menus', async () => {
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
        account.plan = plan;
        await fakeAccountsRepository.save(account);

        const establishment = await fakeEstablishmentRepository.create({
            cnpj: 98986598659800,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'does-dinner',
        });

        const product = await fakeProductRepository.create({
            name: 'Bolo de chocolate',
            description: 'Delicioso bolo de chocolate',
            price: 9.9,
            quantity: 10,
            category_id: 1,
            owner_id: account.id,
        });

        const menu1 = await fakeMenuRepository.create({
            title: 'Does Monday Menu',
            description: 'Our best foods Monday',
            owner: account,
            establishment,
            products: [
                {
                    product_id: product.id,
                },
            ],
        });

        const menu2 = await fakeMenuRepository.create({
            title: 'Does Tuesday Menu',
            description: 'Our best foods Tuesday',
            owner: account,
            establishment,
            products: [
                {
                    product_id: product.id,
                },
            ],
        });

        const list = await listMenuService.execute({ account_id: account.id });

        expect(list).toEqual([menu1, menu2]);
    });
});

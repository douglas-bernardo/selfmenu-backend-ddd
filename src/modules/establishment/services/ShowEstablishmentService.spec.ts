import AppError from '@shared/errors/AppError';
import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeAccountsRepository from '@modules/account/repositories/fakes/FakeAccountRepository';
import FakeEstablishmentRepository from '../repositories/fakes/FakeEstablishmentRepository';
import ShowEstablishmentService from './ShowEstablishmentService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePlanRepository: FakePlanRepository;
let fakeEstablishmentRepository: FakeEstablishmentRepository;

let showEstablishmentService: ShowEstablishmentService;

describe('ShowEstablishment', () => {
    beforeEach(() => {
        fakeAccountsRepository = new FakeAccountsRepository();
        fakePlanRepository = new FakePlanRepository();
        fakeEstablishmentRepository = new FakeEstablishmentRepository();

        showEstablishmentService = new ShowEstablishmentService(
            fakeAccountsRepository,
            fakeEstablishmentRepository,
        );
    });

    it('should be able to show establishment details', async () => {
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
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'doe-dinner',
        });

        const findEstablishment = await showEstablishmentService.execute({
            id: establishment.id,
            owner_id: account.id,
        });

        expect(findEstablishment.cnpj).toBe(31132548000119);
    });

    it('should not be able to show establishment from non-existing account', async () => {
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
            cnpj: 31132548000119,
            name: "Doe's Dinner",
            description: 'A new establishment',
            establishment_type_id: 1,
            owner_id: account.id,
            subdomain: 'doe-dinner',
        });

        expect(
            showEstablishmentService.execute({
                id: establishment.id,
                owner_id: 'non-existing-account',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to show establishment from non-existing-establishment', async () => {
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

        expect(
            showEstablishmentService.execute({
                id: 'non-existing-establishment',
                owner_id: account.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

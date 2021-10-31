import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import AuthenticateAccountService from './AuthenticateAccountService';

let fakePlanRepository: FakePlanRepository;
let fakeHashProvider: FakeHashProvider;
let fakeAccountsRepository: FakeAccountsRepository;
let authenticateAccountsService: AuthenticateAccountService;

describe('AuthenticateAccount', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeAccountsRepository = new FakeAccountsRepository();

        authenticateAccountsService = new AuthenticateAccountService(
            fakeAccountsRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        const account = await fakeAccountsRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
        });

        const response = await authenticateAccountsService.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.account).toEqual(account);
    });

    it('should not be able to authenticate with non existing account', async () => {
        await expect(
            authenticateAccountsService.execute({
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        const plan = await fakePlanRepository.create(
            'Free',
            'Selfmenu free plan',
        );

        await fakeAccountsRepository.create({
            email: 'johndoe@example.com',
            password: '123456',
            profile_name: 'John',
            plan_id: plan.id,
        });

        await expect(
            authenticateAccountsService.execute({
                email: 'johndoe@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

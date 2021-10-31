import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import CreateAccountService from './CreateAccountService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeHashProvider: FakeHashProvider;
let createAccountsService: CreateAccountService;

describe('CreateAccount', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeAccountsRepository = new FakeAccountsRepository();
        createAccountsService = new CreateAccountService(
            fakeAccountsRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new account', async () => {
        await fakePlanRepository.create('Free', 'Selfmenu free plan');

        const account = await createAccountsService.execute({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
        });

        expect(account).toHaveProperty('id');
    });

    it('should not be able to create a new account with the same email from another', async () => {
        await fakePlanRepository.create('Free', 'Selfmenu free plan');

        await createAccountsService.execute({
            email: 'john@example.com',
            password: '123456',
            profile_name: 'John Doe',
        });

        await expect(
            createAccountsService.execute({
                email: 'john@example.com',
                password: '123456',
                profile_name: 'John Doe',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

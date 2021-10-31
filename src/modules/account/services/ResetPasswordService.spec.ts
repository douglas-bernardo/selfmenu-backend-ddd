import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import FakeAccountTokenRepository from '../repositories/fakes/FakeAccountTokenRepository';
import ResetPasswordService from './ResetPasswordService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeAccountTokenRepository: FakeAccountTokenRepository;
let fakeHashProvider: IHashProvider;

let resetPasswordService: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeAccountTokenRepository = new FakeAccountTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeAccountsRepository,
            fakeAccountTokenRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset password account', async () => {
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

        const { token } = await fakeAccountTokenRepository.generate(account.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '123123',
            token,
        });

        const updatedAccount = await fakeAccountsRepository.findById(
            account.id,
        );

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedAccount?.password).toBe('123123');
    });

    it('should not be able to reset password with non existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'non existing token',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with non existing account', async () => {
        const { token } = await fakeAccountTokenRepository.generate(
            'non-existing-account',
        );

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if passed more than 2 hours', async () => {
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

        const { token } = await fakeAccountTokenRepository.generate(account.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: '123123',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});

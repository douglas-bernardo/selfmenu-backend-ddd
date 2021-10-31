import FakePlanRepository from '@modules/account/repositories/fakes/FakePlanRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeAccountsRepository from '../repositories/fakes/FakeAccountRepository';
import FakeAccountTokenRepository from '../repositories/fakes/FakeAccountTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakePlanRepository: FakePlanRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeAccountTokenRepository: FakeAccountTokenRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakePlanRepository = new FakePlanRepository();
        fakeAccountsRepository = new FakeAccountsRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeAccountTokenRepository = new FakeAccountTokenRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeAccountsRepository,
            fakeMailProvider,
            fakeAccountTokenRepository,
        );
    });

    it('should be able to recover the password using email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

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

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing account', async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'john@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forget password token', async () => {
        const generateToken = jest.spyOn(
            fakeAccountTokenRepository,
            'generate',
        );

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

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(generateToken).toHaveBeenCalledWith(account.id);
    });
});

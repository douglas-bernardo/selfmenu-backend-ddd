import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountsRepository from '../repositories/IAccountRepository';
import IAccountTokenRepository from '../repositories/IAccountTokenRepository';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('AccountTokenRepository')
        private accountTokenRepository: IAccountTokenRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const account = await this.accountsRepository.findByEmail(email);

        if (!account) {
            throw new AppError('Account does not exist');
        }

        const { token } = await this.accountTokenRepository.generate(
            account.id,
        );

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: account.profile_name,
                email: account.email,
            },
            subject: '[SELFMENU] Recuperação de Senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: account.profile_name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;

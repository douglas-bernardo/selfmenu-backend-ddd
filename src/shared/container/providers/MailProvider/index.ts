import { container } from 'tsyringe';

import mailConfig from '@config/mail';

// import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import IMailProvider from './models/IMailProvider';

const providers = {
    // ethereal: container.resolve(EtherealMailProvider), // service off
    ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
    'MailProvider',
    providers[mailConfig.driver],
);

import { injectable, inject } from 'tsyringe';

import Account from '@modules/account/infra/typeorm/entities/Account';
import AppError from '@shared/errors/AppError';
import IAccountsRepository from '../repositories/IAccountRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    email: string;
    password: string;
    profile_name: string;
}

@injectable()
class CreateAccountService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,
        @inject('HashProvider') private hashProvider: IHashProvider,
    ) {}

    public async execute({
        email,
        password,
        profile_name,
    }: IRequest): Promise<Account> {
        const accountExists = await this.accountsRepository.findByEmail(email);

        if (accountExists) {
            throw new AppError('Email already exists');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const account = await this.accountsRepository.create({
            email,
            password: hashedPassword,
            profile_name,
            plan_id: 1, // by default account is created with a free plan - improve this later
        });

        return account;
    }
}

export default CreateAccountService;

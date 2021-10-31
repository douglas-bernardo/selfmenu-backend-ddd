import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/account/providers/HashProvider/models/IHashProvider';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import Waiter from '../infra/typeorm/entities/Waiter';
import IWaiterRepository from '../repositories/IWaiterRepository';

interface IRequest {
    name: string;
    cpf: number;
    username: string;
    password: string;
    owner_id: string;
    establishment_id: string;
}

@injectable()
class CreateWaiterService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        name,
        cpf,
        username,
        password,
        owner_id,
        establishment_id,
    }: IRequest): Promise<Waiter> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Account account not found');
        }

        if (account.plan.name === 'Free') {
            const hasEstablishmentCreated =
                await this.establishmentRepository.findAll({
                    owner_id: account.id,
                });

            if (hasEstablishmentCreated.length > 0) {
                throw new AppError(
                    'Only Premium accounts can register waiters.',
                );
            }
        }

        const waiterExists = await this.waiterRepository.findByCPF({
            cpf,
            owner_id,
        });

        if (waiterExists) {
            throw new AppError('Waiter already exists with this cpf');
        }

        const establishment = await this.establishmentRepository.findById({
            establishment_id,
            owner_id,
        });

        if (!establishment) {
            throw new AppError('Establishment not found');
        }

        if (!establishment.active) {
            throw new AppError('Establishment inactive. Not allowed.');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const waiter = await this.waiterRepository.create({
            name,
            cpf,
            password: hashedPassword,
            username,
            owner_id: account.id,
            establishment_id: establishment.id,
        });

        return waiter;
    }
}

export default CreateWaiterService;

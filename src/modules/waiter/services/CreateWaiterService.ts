import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/account/providers/HashProvider/models/IHashProvider';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Waiter from '../infra/typeorm/entities/Waiter';
import IWaiterRepository from '../repositories/IWaiterRepository';

interface IRequest {
    name: string;
    cpf: number;
    username: string;
    password: string;
    owner_id: string;
    establishment_id: string;
    avatar?: string;
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

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({
        name,
        cpf,
        username,
        password,
        owner_id,
        establishment_id,
        avatar,
    }: IRequest): Promise<Waiter> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Conta não encontrada');
        }

        if (account.plan.name === 'Free') {
            const hasEstablishmentCreated =
                await this.establishmentRepository.findAll({
                    owner_id: account.id,
                });

            if (hasEstablishmentCreated.length > 0) {
                throw new AppError(
                    'Somente contas Premium podem registrar novos garçons',
                );
            }
        }

        const waiterExists = await this.waiterRepository.findByCPF({
            cpf,
            owner_id,
        });

        if (waiterExists) {
            throw new AppError('Já existe um garçom cadastrado com este CPF');
        }

        const establishment = await this.establishmentRepository.findById({
            establishment_id,
            owner_id,
        });

        if (!establishment) {
            throw new AppError('Estabelecimento não encontrado');
        }

        if (!establishment.active) {
            throw new AppError(
                'Estabelecimento inativo. Operação não permitida',
            );
        }

        let filename: string | undefined;
        if (avatar) {
            filename = await this.storageProvider.saveFile(avatar);
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const waiter = await this.waiterRepository.create({
            name,
            cpf,
            password: hashedPassword,
            username,
            owner_id: account.id,
            establishment_id: establishment.id,
            avatar: filename,
        });

        return waiter;
    }
}

export default CreateWaiterService;

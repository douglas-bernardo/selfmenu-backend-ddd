import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/account/providers/HashProvider/models/IHashProvider';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Waiter from '../infra/typeorm/entities/Waiter';
import IWaiterRepository from '../repositories/IWaiterRepository';

interface IRequest {
    owner_id: string;
    waiter_id: string;
    name: string;
    cpf: number;
    establishment_id: string;
    username?: string;
    password?: string;
    avatar?: string;
    active?: boolean;
}

@injectable()
class UpdateWaiterService {
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
        waiter_id,
        name,
        cpf,
        username,
        password,
        owner_id,
        establishment_id,
        avatar,
        active,
    }: IRequest): Promise<Waiter> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Conta não encontrada');
        }

        const waiterToEdit = await this.waiterRepository.findById({
            waiter_id,
        });

        if (!waiterToEdit) {
            throw new AppError('Garçom não encontrado.');
        }

        const waiterExists = await this.waiterRepository.findByCPF({
            cpf,
        });

        if (waiterExists && waiterExists.id !== waiterToEdit.id) {
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
            if (waiterToEdit.avatar) {
                await this.storageProvider.deleteFile(waiterToEdit.avatar);
            }

            filename = await this.storageProvider.saveFile(avatar);
        }

        let hashedPassword: string | undefined;
        if (password) {
            hashedPassword = await this.hashProvider.generateHash(password);
        }

        const waiterEdited = Object.assign(waiterToEdit, {
            name,
            cpf,
            username,
            password: hashedPassword,
            establishment_id: establishment.id,
            avatar: filename,
            active,
        });

        return this.waiterRepository.save(waiterEdited);
    }
}

export default UpdateWaiterService;

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';
import Table from '../infra/typeorm/entities/Table';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    capacity: number;
    establishment_id: string;
    waiter_id: string;
    owner_id: string;
}

@injectable()
class CreateTableService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,

        @inject('TableRepository')
        private tableRepository: ITableRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,
    ) {}

    public async execute({
        capacity,
        establishment_id,
        waiter_id,
        owner_id,
    }: IRequest): Promise<Table> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Account account not found');
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

        let table_number = 1;
        const lastTableCreated = await this.tableRepository.findLastCreated(
            establishment_id,
        );

        if (lastTableCreated) {
            table_number += lastTableCreated.number;
        }

        const waiter = await this.waiterRepository.findById({
            waiter_id,
            owner_id,
        });

        if (!waiter) {
            throw new AppError('Waiter not found');
        }

        const table = await this.tableRepository.create({
            number: table_number,
            capacity,
            establishment,
            waiter,
            owner: account,
        });

        return table;
    }
}

export default CreateTableService;

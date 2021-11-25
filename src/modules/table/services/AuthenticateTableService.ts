import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    id: string;
}

interface IResponse {
    table_id: string;
    table_token: string;
    table_number: number;
    status_table_id: number;
    establishment_name: string;
    establishment_id: string;
    owner_id: string;
    waiter: string;
}

@injectable()
class AuthenticateTableService {
    constructor(
        @inject('TableRepository')
        private tableRepository: ITableRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,

        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,
    ) {}

    public async execute({ id }: IRequest): Promise<IResponse> {
        const table = await this.tableRepository.findById({
            table_id: id,
        });

        if (!table) {
            throw new AppError('table not found');
        }

        const waiter = await this.waiterRepository.findById({
            waiter_id: table.waiter_id,
        });

        if (!waiter) {
            throw new AppError('waiter not found');
        }

        const establishment = await this.establishmentRepository.findById({
            establishment_id: table.establishment_id,
        });

        if (!establishment) {
            throw new AppError('establishment not found');
        }

        return {
            table_id: table.id,
            table_number: table.number,
            table_token: table.token,
            status_table_id: table.status_table_id,
            waiter: waiter.name,
            establishment_name: establishment.name,
            establishment_id: establishment.id,
            owner_id: table.owner_id,
        };
    }
}

export default AuthenticateTableService;

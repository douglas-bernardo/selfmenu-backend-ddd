import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    owner_id: string;
    table_id: string;
    status_table_id: number;
}

@injectable()
class UpdateStatusTableService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('TableRepository')
        private tableRepository: ITableRepository,
    ) {}

    public async execute({
        owner_id,
        table_id,
        status_table_id,
    }: IRequest): Promise<void> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Account account not found');
        }

        const table = await this.tableRepository.findById({ table_id });

        if (!table) {
            throw new AppError('Table not found');
        }

        table.status_table_id = status_table_id;

        await this.tableRepository.save(table);
    }
}

export default UpdateStatusTableService;

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    owner_id: string;
    table_id: string;
}

@injectable()
class CloseTableService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('TableRepository')
        private tableRepository: ITableRepository,
    ) {}

    public async execute({ owner_id, table_id }: IRequest): Promise<void> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Account account not found');
        }

        const table = await this.tableRepository.findById({ table_id });

        if (!table) {
            throw new AppError('Table not found');
        }

        const hasOrderPaymentPending = table.orders
            .filter(order => order.status_order_id !== 7)
            .some(order => order.status_order_id !== 6);

        if (hasOrderPaymentPending) {
            throw new AppError('Existem pedidos pendentes na mesa');
        }

        table.status_table_id = 1;
        table.token = null;

        await this.tableRepository.save(table);
    }
}

export default CloseTableService;

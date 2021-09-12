import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ITableRepository from '../repositories/ITableRepository';
import Table from '../infra/typeorm/entities/Table';

interface IRequest {
    id: string;
    restaurant_id: string;
}

@injectable()
class ShowTableService {
    constructor(
        @inject('TableRepository')
        private tableRepository: ITableRepository,
    ) {}

    public async execute({ id, restaurant_id }: IRequest): Promise<Table> {
        const table = await this.tableRepository.findById({
            table_id: id,
            restaurant_id,
        });

        if (!table) {
            throw new AppError('Table not found');
        }

        return table;
    }
}

export default ShowTableService;

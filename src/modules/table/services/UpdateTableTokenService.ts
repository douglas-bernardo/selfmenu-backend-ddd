import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    table_number: number;
    restaurant_id: string;
}

interface IResponse {
    number: number;
    token: string;
}

@injectable()
class UpdateTableTokenService {
    constructor(
        @inject('TableRepository')
        private tableRepository: ITableRepository,
    ) {}

    public async execute({
        table_number,
        restaurant_id,
    }: IRequest): Promise<IResponse> {
        const table = await this.tableRepository.findByNumber({
            number: table_number,
            restaurant_id,
        });

        if (!table) {
            throw new AppError('Table not found');
        }

        const token = (Math.random() + 1)
            .toString(36)
            .substring(3)
            .toUpperCase();

        table.token = token;

        await this.tableRepository.save(table);

        const { number, token: table_token } = table;

        return {
            number,
            token: table_token,
        };
    }
}

export default UpdateTableTokenService;

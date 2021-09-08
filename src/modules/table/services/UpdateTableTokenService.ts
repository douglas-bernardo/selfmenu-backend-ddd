import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    table_code: string;
    restaurant_id: string;
}

interface IResponse {
    table: string;
    token: string;
}

@injectable()
class UpdateTableTokenService {
    constructor(
        @inject('TableRepository')
        private tableRepository: ITableRepository,
    ) {}

    public async execute({
        table_code,
        restaurant_id,
    }: IRequest): Promise<IResponse> {
        // const user = await this.usersRepository.findById(owner_id);

        // if (!user) {
        //     throw new AppError('User account not found');
        // }

        // const restaurant = await this.restaurantRepository.findById({
        //     restaurant_id,
        //     owner_id,
        // });

        // if (!restaurant) {
        //     throw new AppError('Restaurant not found');
        // }

        // if (!restaurant.active) {
        //     throw new AppError('Restaurant inactive. Not allowed.');
        // }

        const table = await this.tableRepository.findByCode({
            code: table_code,
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

        const { code, token: table_token } = table;

        return {
            table: code,
            token: table_token,
        };
    }
}

export default UpdateTableTokenService;

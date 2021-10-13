import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    id: string;
}

interface IResponse {
    table_id: string;
    table_number: number;
    establishment_name?: string;
    owner_id: string;
    waiter?: string;
}

@injectable()
class AuthenticateTableService {
    constructor(
        @inject('TableRepository')
        private tableRepository: ITableRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,

        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,
    ) {}

    public async execute({ id }: IRequest): Promise<IResponse> {
        const table = await this.tableRepository.findById({
            table_id: id,
        });

        if (!table) {
            throw new AppError('Table not found');
        }

        const waiter = await this.waiterRepository.findById({
            waiter_id: table.waiter_id,
        });

        const establishment = await this.restaurantRepository.findById({
            restaurant_id: table.restaurant_id,
        });

        return {
            table_id: table.id,
            table_number: table.number,
            waiter: waiter?.name,
            establishment_name: establishment?.name,
            owner_id: table.owner_id,
        };
    }
}

export default AuthenticateTableService;

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';
import Table from '../infra/typeorm/entities/Table';
import ITableRepository from '../repositories/ITableRepository';

interface IRequest {
    code: string;
    capacity: number;
    restaurant_id: string;
    waiter_id: string;
    owner_id: string;
}

@injectable()
class CreateTableService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,

        @inject('TableRepository')
        private tableRepository: ITableRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,
    ) {}

    public async execute({
        code,
        capacity,
        restaurant_id,
        waiter_id,
        owner_id,
    }: IRequest): Promise<Table> {
        const user = await this.usersRepository.findById(owner_id);

        if (!user) {
            throw new AppError('User account not found');
        }

        const restaurant = await this.restaurantRepository.findById(
            restaurant_id,
            owner_id,
        );

        if (!restaurant) {
            throw new AppError('Restaurant not found');
        }

        if (!restaurant.active) {
            throw new AppError('Restaurant inactive. Not allowed.');
        }

        const codeTableExists = await this.tableRepository.findByCode({
            code,
            restaurant_id,
        });

        if (codeTableExists) {
            throw new AppError('Table Code already used');
        }

        const waiter = await this.waiterRepository.findById({
            waiter_id,
            owner_id,
        });

        if (!waiter) {
            throw new AppError('Waiter not found');
        }

        const table = await this.tableRepository.create({
            code,
            capacity,
            restaurant_id,
            waiter_id,
        });

        return table;
    }
}

export default CreateTableService;

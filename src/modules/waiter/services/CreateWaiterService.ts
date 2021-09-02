import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import Waiter from '../infra/typeorm/entities/Waiter';
import IWaiterRepository from '../repositories/IWaiterRepository';

interface IRequest {
    name: string;
    cpf: string;
    username: string;
    password: string;
    owner_id: string;
    restaurant_id: string;
}

@injectable()
class CreateWaiterService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        name,
        cpf,
        username,
        password,
        owner_id,
        restaurant_id,
    }: IRequest): Promise<Waiter> {
        const waiterExists = await this.waiterRepository.findByCPF({
            cpf,
            owner_id,
        });

        if (waiterExists) {
            throw new AppError('Waiter already exists with this cpf');
        }

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

        const hashedPassword = await this.hashProvider.generateHash(password);

        const waiter = await this.waiterRepository.create({
            name,
            cpf,
            password: hashedPassword,
            username,
            owner_id: user.id,
            restaurant_id: restaurant.id,
        });

        return waiter;
    }
}

export default CreateWaiterService;

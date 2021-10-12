import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IRestaurantRepository from '../repositories/IRestaurantRepository';
import Restaurant from '../infra/typeorm/entities/Restaurant';

interface IRequest {
    id: string;
    owner_id?: string;
}

@injectable()
class ShowRestaurantService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,
    ) {}

    public async execute({ id, owner_id }: IRequest): Promise<Restaurant> {
        if (owner_id) {
            const user = await this.usersRepository.findById(owner_id);

            if (!user) {
                throw new AppError('User account not found');
            }
        }

        const restaurant = await this.restaurantRepository.findById({
            restaurant_id: id,
            owner_id,
        });

        if (!restaurant) {
            throw new AppError('Restaurant not found');
        }

        return restaurant;
    }
}

export default ShowRestaurantService;

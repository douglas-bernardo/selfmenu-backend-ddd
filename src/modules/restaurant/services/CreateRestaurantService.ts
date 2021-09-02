import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import slugify from '@shared/utils/Helpers';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IRestaurantRepository from '../repositories/IRestaurantRepository';
import Restaurant from '../infra/typeorm/entities/Restaurant';

interface IRequest {
    name: string;
    cnpj: string;
    description: string;
    restaurant_type_id: number;
    user_id: string;
}

@injectable()
class CreateRestaurantService {
    constructor(
        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,

        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({
        name,
        cnpj,
        description,
        restaurant_type_id,
        user_id,
    }: IRequest): Promise<Restaurant> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        if (!user.active) {
            throw new AppError('Inactive User. Not allowed.');
        }

        if (user.plan.name === 'Free') {
            const hasRestaurantCreated =
                await this.restaurantRepository.findAll({ owner_id: user.id });

            if (hasRestaurantCreated.length > 0) {
                throw new AppError(
                    'Only Premium users can create more than one restaurant by account.',
                );
            }
        }

        const restaurant = await this.restaurantRepository.create({
            name,
            cnpj,
            description,
            restaurant_type_id,
            owner_id: user.id,
            subdomain: slugify(name),
        });

        return restaurant;
    }
}

export default CreateRestaurantService;

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountRepository from '@modules/accounts/repositories/IAccountRepository';
import slugify from '@shared/utils/Helpers';
import IRestaurantRepository from '../repositories/IRestaurantRepository';
import Restaurant from '../infra/typeorm/entities/Restaurant';

interface IRequest {
    name: string;
    cnpj: string;
    description: string;
    restaurant_type_id: number;
    account_id: string;
}

@injectable()
class CreateRestaurantService {
    constructor(
        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,

        @inject('AccountRepository')
        private accountRepository: IAccountRepository,
    ) {}

    public async execute({
        name,
        cnpj,
        description,
        restaurant_type_id,
        account_id,
    }: IRequest): Promise<Restaurant> {
        const account = await this.accountRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        if (!account.active) {
            throw new AppError('Associate account inactive. Not allowed.');
        }

        if (account.plan.name === 'Free') {
            const hasRestaurantCreated =
                await this.restaurantRepository.findAll({ account_id });

            if (hasRestaurantCreated.length > 0) {
                throw new AppError(
                    'Only Premium accounts can create more than restaurant.',
                );
            }
        }

        const restaurant = await this.restaurantRepository.create({
            name,
            cnpj,
            description,
            restaurant_type_id,
            account_id,
            subdomain: slugify(name),
        });

        return restaurant;
    }
}

export default CreateRestaurantService;

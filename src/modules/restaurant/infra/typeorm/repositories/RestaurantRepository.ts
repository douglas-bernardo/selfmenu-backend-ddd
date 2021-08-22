import { getRepository, Repository } from 'typeorm';

import ICreateRestaurantDTO from '@modules/restaurant/dtos/ICreateRestaurantDTO';
import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import IFindAllRestaurantsDTO from '@modules/restaurant/dtos/IFindAllRestaurantsDTO';

class RestaurantRepository implements IRestaurantRepository {
    private ormRepository: Repository<Restaurant>;

    constructor() {
        this.ormRepository = getRepository(Restaurant);
    }

    public async findAll({
        account_id,
    }: IFindAllRestaurantsDTO): Promise<Restaurant[]> {
        let restaurants: Restaurant[];

        if (account_id) {
            restaurants = await this.ormRepository.find({
                where: {
                    account_id,
                },
            });
        } else {
            restaurants = await this.ormRepository.find();
        }

        return restaurants;
    }

    public async create(data: ICreateRestaurantDTO): Promise<Restaurant> {
        const restaurant = this.ormRepository.create(data);

        await this.ormRepository.save(restaurant);

        return restaurant;
    }
}

export default RestaurantRepository;

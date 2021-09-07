import { getRepository, Repository } from 'typeorm';

import ICreateRestaurantDTO from '@modules/restaurant/dtos/ICreateRestaurantDTO';
import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import IFindAllRestaurantsDTO from '@modules/restaurant/dtos/IFindAllRestaurantsDTO';
import IFindByIdRestaurantDTO from '@modules/restaurant/dtos/IFindByIdRestaurantDTO';

class RestaurantRepository implements IRestaurantRepository {
    private ormRepository: Repository<Restaurant>;

    constructor() {
        this.ormRepository = getRepository(Restaurant);
    }

    public async findById({
        restaurant_id,
        owner_id,
    }: IFindByIdRestaurantDTO): Promise<Restaurant | undefined> {
        let restaurant: Restaurant | undefined;

        if (owner_id) {
            restaurant = await this.ormRepository.findOne({
                where: {
                    id: restaurant_id,
                    owner_id,
                },
            });
        } else {
            restaurant = await this.ormRepository.findOne(restaurant_id);
        }
        return restaurant;
    }

    public async findAll({
        owner_id,
    }: IFindAllRestaurantsDTO): Promise<Restaurant[]> {
        let restaurants: Restaurant[];

        if (owner_id) {
            restaurants = await this.ormRepository.find({
                where: {
                    owner_id,
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

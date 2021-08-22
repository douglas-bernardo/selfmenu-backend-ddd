import { v4 as uuid } from 'uuid';

import ICreateRestaurantDTO from '@modules/restaurant/dtos/ICreateRestaurantDTO';
import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import IFindAllRestaurantsDTO from '@modules/restaurant/dtos/IFindAllRestaurantsDTO';
import IRestaurantRepository from '../IRestaurantRepository';

class FakeRestaurantRepository implements IRestaurantRepository {
    private restaurants: Restaurant[] = [];

    public async findAll({
        account_id,
    }: IFindAllRestaurantsDTO): Promise<Restaurant[]> {
        let { restaurants } = this;

        if (account_id) {
            restaurants = this.restaurants.filter(
                restaurant => restaurant.account_id === account_id,
            );
        }

        return restaurants;
    }

    public async create(data: ICreateRestaurantDTO): Promise<Restaurant> {
        const restaurant = new Restaurant();

        Object.assign(restaurant, { id: uuid() }, data);

        this.restaurants.push(restaurant);
        return restaurant;
    }
}

export default FakeRestaurantRepository;

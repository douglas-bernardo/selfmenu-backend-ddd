import { v4 as uuid } from 'uuid';

import ICreateRestaurantDTO from '@modules/restaurant/dtos/ICreateRestaurantDTO';
import Restaurant from '@modules/restaurant/infra/typeorm/entities/Restaurant';
import IFindAllRestaurantsDTO from '@modules/restaurant/dtos/IFindAllRestaurantsDTO';
import IFindByIdRestaurantDTO from '@modules/restaurant/dtos/IFindByIdRestaurantDTO';
import IFindByCNPJRestaurantDTO from '@modules/restaurant/dtos/IFindByCNPJRestaurantDTO';
import IRestaurantRepository from '../IRestaurantRepository';

class FakeRestaurantRepository implements IRestaurantRepository {
    private restaurants: Restaurant[] = [];

    public async findByCNPJ({
        cnpj,
    }: IFindByCNPJRestaurantDTO): Promise<Restaurant | undefined> {
        const findRestaurant = this.restaurants.find(
            restaurant => restaurant.cnpj === cnpj,
        );

        return findRestaurant;
    }

    public async findById({
        restaurant_id,
        owner_id,
    }: IFindByIdRestaurantDTO): Promise<Restaurant | undefined> {
        let findRestaurant: Restaurant | undefined;

        if (owner_id) {
            findRestaurant = this.restaurants.find(
                restaurant =>
                    restaurant.id === restaurant_id &&
                    restaurant.owner_id === owner_id,
            );
        } else {
            findRestaurant = this.restaurants.find(
                restaurant => restaurant.id === restaurant_id,
            );
        }

        return findRestaurant;
    }

    public async findAll({
        owner_id,
    }: IFindAllRestaurantsDTO): Promise<Restaurant[]> {
        let { restaurants } = this;

        if (owner_id) {
            restaurants = this.restaurants.filter(
                restaurant => restaurant.owner_id === owner_id,
            );
        }

        return restaurants;
    }

    public async create(data: ICreateRestaurantDTO): Promise<Restaurant> {
        const restaurant = new Restaurant();

        Object.assign(restaurant, { id: uuid(), active: true }, data);
        this.restaurants.push(restaurant);
        return restaurant;
    }

    public async save(restaurant: Restaurant): Promise<Restaurant> {
        const findIndex = this.restaurants.findIndex(
            findRestaurant => findRestaurant.id === restaurant.id,
        );

        this.restaurants[findIndex] = restaurant;
        return restaurant;
    }
}

export default FakeRestaurantRepository;

import ICreateRestaurantDTO from '../dtos/ICreateRestaurantDTO';
import IFindAllRestaurantsDTO from '../dtos/IFindAllRestaurantsDTO';
import Restaurant from '../infra/typeorm/entities/Restaurant';

export default interface IRestaurantRepository {
    findAll(data: IFindAllRestaurantsDTO): Promise<Restaurant[]>;
    findById(
        restaurant_id: string,
        owner_id?: string,
    ): Promise<Restaurant | undefined>;
    create(data: ICreateRestaurantDTO): Promise<Restaurant>;
}

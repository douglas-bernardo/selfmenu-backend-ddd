import ICreateRestaurantDTO from '../dtos/ICreateRestaurantDTO';
import IFindAllRestaurantsDTO from '../dtos/IFindAllRestaurantsDTO';
import Restaurant from '../infra/typeorm/entities/Restaurant';

export default interface IRestaurantRepository {
    findAll(data: IFindAllRestaurantsDTO): Promise<Restaurant[]>;
    create(data: ICreateRestaurantDTO): Promise<Restaurant>;
}

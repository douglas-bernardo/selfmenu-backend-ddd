import ICreateRestaurantDTO from '../dtos/ICreateRestaurantDTO';
import IFindAllRestaurantsDTO from '../dtos/IFindAllRestaurantsDTO';
import IFindByIdRestaurantDTO from '../dtos/IFindByIdRestaurantDTO';
import Restaurant from '../infra/typeorm/entities/Restaurant';

export default interface IRestaurantRepository {
    findAll(data: IFindAllRestaurantsDTO): Promise<Restaurant[]>;
    findById(data: IFindByIdRestaurantDTO): Promise<Restaurant | undefined>;
    create(data: ICreateRestaurantDTO): Promise<Restaurant>;
}

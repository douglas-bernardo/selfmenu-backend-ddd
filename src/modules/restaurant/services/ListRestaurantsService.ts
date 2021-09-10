import { injectable, inject } from 'tsyringe';
import Restaurant from '../infra/typeorm/entities/Restaurant';
import IRestaurantRepository from '../repositories/IRestaurantRepository';

interface IRequest {
    owner_id?: string;
}

@injectable()
class ListRestaurantsService {
    constructor(
        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,
    ) {}

    public async execute({ owner_id }: IRequest): Promise<Restaurant[]> {
        return this.restaurantRepository.findAll({ owner_id });
    }
}

export default ListRestaurantsService;

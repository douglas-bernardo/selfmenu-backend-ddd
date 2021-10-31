import ICreateRestaurantDTO from '../dtos/ICreateEstablishmentDTO';
import IFindAllRestaurantsDTO from '../dtos/IFindAllEstablishmentDTO';
import IFindByCNPJRestaurantDTO from '../dtos/IFindByCNPJEstablishmentDTO';
import IFindByIdRestaurantDTO from '../dtos/IFindByIdEstablishmentDTO';
import Establishment from '../infra/typeorm/entities/Establishment';

export default interface IEstablishmentRepository {
    findAll(data: IFindAllRestaurantsDTO): Promise<Establishment[]>;
    findById(data: IFindByIdRestaurantDTO): Promise<Establishment | undefined>;
    findByCNPJ(
        data: IFindByCNPJRestaurantDTO,
    ): Promise<Establishment | undefined>;
    create(data: ICreateRestaurantDTO): Promise<Establishment>;
}

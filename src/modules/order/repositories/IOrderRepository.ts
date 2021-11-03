import IFindAllEstablishmentsDTO from '@modules/establishment/dtos/IFindAllEstablishmentDTO';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import IFindAllOrdersDTO from '../dtos/IFindAllOrdersDTO';
import IFindByIdOrderDTO from '../dtos/IFindByIdOrderDTO';
import Order from '../infra/typeorm/entities/Order';

export default interface IOrderRepository {
    findAll(data: IFindAllOrdersDTO): Promise<Order[]>;
    findAllByEstablishmentId(data: IFindAllEstablishmentsDTO): Promise<Order[]>;
    create(data: ICreateOrderDTO): Promise<Order>;
    findById(data: IFindByIdOrderDTO): Promise<Order | undefined>;
}

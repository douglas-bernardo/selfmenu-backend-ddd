import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import IFindAllOrdersDTO from '../dtos/IFindAllOrdersDTO';
import Order from '../infra/typeorm/entities/Order';

export default interface IOrderRepository {
    findAll(data: IFindAllOrdersDTO): Promise<Order[]>;
    create(data: ICreateOrderDTO): Promise<Order>;
    findById(id: string): Promise<Order | undefined>;
}

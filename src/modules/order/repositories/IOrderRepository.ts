import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import Order from '../infra/typeorm/entities/Order';

export default interface IOrderRepository {
    create(data: ICreateOrderDTO): Promise<Order>;
    findById(id: string): Promise<Order | undefined>;
}

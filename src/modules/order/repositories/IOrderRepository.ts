import { IFindAllByEstablishmentDTO } from '../dtos/IFindAllByEstablishmentDTO';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';
import { IFindAllOrdersByTableDTO } from '../dtos/IFindAllOrdersByTableDTO';
import IFindByIdOrderDTO from '../dtos/IFindByIdOrderDTO';
import Order from '../infra/typeorm/entities/Order';

export default interface IOrderRepository {
    findAllByTable(data: IFindAllOrdersByTableDTO): Promise<Order[]>;

    findAllByEstablishmentId(
        data: IFindAllByEstablishmentDTO,
    ): Promise<Order[]>;

    create(data: ICreateOrderDTO): Promise<Order>;

    findById(data: IFindByIdOrderDTO): Promise<Order | undefined>;

    save(order: Order): Promise<Order>;
}

import { injectable, inject } from 'tsyringe';
import Order from '../infra/typeorm/entities/Order';
import IOrderRepository from '../repositories/IOrderRepository';

interface IRequest {
    owner_id: string;
    table_id?: string;
}

@injectable()
class ListOrdersService {
    constructor(
        @inject('OrderRepository') private orderRepository: IOrderRepository,
    ) {}

    public async execute({ owner_id, table_id }: IRequest): Promise<Order[]> {
        return this.orderRepository.findAll({
            owner_id,
            table_id,
        });
    }
}

export default ListOrdersService;

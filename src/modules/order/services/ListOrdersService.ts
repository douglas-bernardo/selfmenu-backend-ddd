import { injectable, inject } from 'tsyringe';
import Order from '../infra/typeorm/entities/Order';
import IOrderRepository from '../repositories/IOrderRepository';

interface IRequest {
    restaurant_id: string;
}

@injectable()
class ListOrdersService {
    constructor(
        @inject('OrderRepository') private orderRepository: IOrderRepository,
    ) {}

    public async execute({ restaurant_id }: IRequest): Promise<Order[]> {
        return this.orderRepository.findAll({ restaurant_id });
    }
}

export default ListOrdersService;

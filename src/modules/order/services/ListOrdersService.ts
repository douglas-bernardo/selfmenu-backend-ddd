import { injectable, inject } from 'tsyringe';
import Order from '../infra/typeorm/entities/Order';
import IOrderRepository from '../repositories/IOrderRepository';

interface IRequest {
    establishment_id: string;
}

@injectable()
class ListOrdersService {
    constructor(
        @inject('OrderRepository') private orderRepository: IOrderRepository,
    ) {}

    public async execute({ establishment_id }: IRequest): Promise<Order[]> {
        return this.orderRepository.findAll({ establishment_id });
    }
}

export default ListOrdersService;

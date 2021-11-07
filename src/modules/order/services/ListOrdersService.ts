import { injectable, inject } from 'tsyringe';
import Order from '../infra/typeorm/entities/Order';
import IOrderRepository from '../repositories/IOrderRepository';

interface IRequest {
    owner_id: string;
    table_id?: string;
    table_token?: string;
}

@injectable()
class ListOrdersService {
    constructor(
        @inject('OrderRepository') private orderRepository: IOrderRepository,
    ) {}

    public async execute({
        owner_id,
        table_id,
        table_token,
    }: IRequest): Promise<Order[]> {
        return this.orderRepository.findAll({
            owner_id,
            table_id,
            table_token,
        });
    }
}

export default ListOrdersService;

import { injectable, inject } from 'tsyringe';
import Order from '../infra/typeorm/entities/Order';
import IOrderRepository from '../repositories/IOrderRepository';

interface IRequest {
    owner_id: string;
    establishment_id: string;
    status_order_id?: string;
}

@injectable()
export class ListOrdersByEstablishmentService {
    constructor(
        @inject('OrderRepository') private orderRepository: IOrderRepository,
    ) {}

    public async execute({
        establishment_id,
        status_order_id,
    }: IRequest): Promise<Order[]> {
        const status_ids = status_order_id?.split(',');
        return this.orderRepository.findAllByEstablishmentId({
            establishment_id,
            status_order_id: status_ids,
        });
    }
}

export default ListOrdersByEstablishmentService;

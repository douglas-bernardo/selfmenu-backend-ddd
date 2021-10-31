import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import Order from '../infra/typeorm/entities/Order';
import IOrderRepository from '../repositories/IOrderRepository';

interface IRequest {
    id: string;
}

@injectable()
class ShowOrderService {
    constructor(
        @inject('OrderRepository')
        private orderRepository: IOrderRepository,
    ) {}

    public async execute({ id }: IRequest): Promise<Order> {
        const order = await this.orderRepository.findById({
            id,
        });

        if (!order) {
            throw new AppError('Order not found');
        }

        return order;
    }
}

export default ShowOrderService;

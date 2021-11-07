import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { getRepository } from 'typeorm';

import IOrderRepository from '../repositories/IOrderRepository';

import StatusOrder from '../infra/typeorm/entities/StatusOrder';
import OrderProduct from '../infra/typeorm/entities/OrderProduct';

interface IRequest {
    order_id: string;
}

@injectable()
class OrderCancelService {
    constructor(
        @inject('OrderRepository')
        private orderRepository: IOrderRepository,
    ) {}

    public async execute({ order_id }: IRequest): Promise<void> {
        const order = await this.orderRepository.findById({ id: order_id });

        if (!order) {
            throw new AppError('Pedido não encontrado');
        }

        if (order.status_order_id === 5) {
            throw new AppError('Pedido já foi cancelado!');
        }

        const statusOrderRepository = getRepository(StatusOrder);
        const newStatus = await statusOrderRepository.findOne(5);

        if (!newStatus) {
            throw new AppError('Status inválido!');
        }

        const orderProductsRepository = getRepository(OrderProduct);
        const productsToDelete = await orderProductsRepository.find({
            where: {
                order_id,
            },
        });

        await orderProductsRepository.remove(productsToDelete);

        order.status_order = newStatus;
        order.order_products = [];
        await this.orderRepository.save(order);
    }
}

export default OrderCancelService;

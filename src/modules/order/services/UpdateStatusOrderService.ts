import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { getRepository } from 'typeorm';

import IOrderRepository from '../repositories/IOrderRepository';

import StatusOrder from '../infra/typeorm/entities/StatusOrder';
import OrderProduct from '../infra/typeorm/entities/OrderProduct';
import Order from '../infra/typeorm/entities/Order';

interface IRequest {
    order_id: string;
    status_order_id: number;
}

@injectable()
class UpdateStatusOrderService {
    constructor(
        @inject('OrderRepository')
        private orderRepository: IOrderRepository,
    ) {}

    public async execute({
        order_id,
        status_order_id,
    }: IRequest): Promise<Order> {
        const order = await this.orderRepository.findById({ id: order_id });

        if (!order) {
            throw new AppError('Pedido não encontrado');
        }

        if (order.status_order_id === 7) {
            throw new AppError('Pedido já foi cancelado!');
        }

        const statusOrderRepository = getRepository(StatusOrder);
        const newStatus = await statusOrderRepository.findOne(status_order_id);

        if (!newStatus) {
            throw new AppError('Status de pedido inválido!');
        }

        if (status_order_id === 7) {
            const orderProductsRepository = getRepository(OrderProduct);
            const productsToDelete = await orderProductsRepository.find({
                where: {
                    order_id,
                },
            });

            await orderProductsRepository.remove(productsToDelete);
            order.order_products = [];
        }

        order.status_order = newStatus;
        return this.orderRepository.save(order);
    }
}

export default UpdateStatusOrderService;

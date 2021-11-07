import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { getRepository } from 'typeorm';
import IOrderRepository from '../repositories/IOrderRepository';
import OrderProduct from '../infra/typeorm/entities/OrderProduct';

interface IRequest {
    order_id: string;
    order_product_id: string;
}

@injectable()
class RemoveOrderProductService {
    constructor(
        @inject('OrderRepository')
        private orderRepository: IOrderRepository,
    ) {}

    public async execute({
        order_id,
        order_product_id,
    }: IRequest): Promise<void> {
        const order = await this.orderRepository.findById({ id: order_id });

        if (!order) {
            throw new AppError('Pedido não encontrado');
        }

        if (order.status_order_id !== 1) {
            throw new AppError(
                'O pedido está em preparação ou já foi entregue. Exclusão não permitida!',
            );
        }

        const orderProductsRepository = getRepository(OrderProduct);
        const productToDelete = await orderProductsRepository.findOne(
            order_product_id,
        );

        if (!productToDelete) {
            throw new AppError('Produto não encontrado no pedido atual');
        }

        await orderProductsRepository.remove(productToDelete);
    }
}

export default RemoveOrderProductService;

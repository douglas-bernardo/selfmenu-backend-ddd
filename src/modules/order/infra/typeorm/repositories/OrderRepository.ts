import ICreateOrderDTO from '@modules/order/dtos/ICreateOrderDTO';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { getRepository, Repository } from 'typeorm';

import Order from '../entities/Order';

class OrdersRepository implements IOrderRepository {
    private ormRepository: Repository<Order>;

    constructor() {
        this.ormRepository = getRepository(Order);
    }

    public async create({
        status_order_id,
        items,
        restaurant,
        table,
        waiter,
    }: ICreateOrderDTO): Promise<Order> {
        const order = this.ormRepository.create({
            status_order_id,
            restaurant,
            waiter,
            table,
            order_items: items,
        });

        await this.ormRepository.save(order);

        return order;
    }

    public async findById(id: string): Promise<Order | undefined> {
        const order = this.ormRepository.findOne(id, {
            relations: ['order_items', 'table'],
        });

        return order;
    }
}

export default OrdersRepository;

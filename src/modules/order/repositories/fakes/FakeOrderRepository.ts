import { v4 as uuid } from 'uuid';

import ICreateOrderDTO from '@modules/order/dtos/ICreateOrderDTO';
import Order from '@modules/order/infra/typeorm/entities/Order';

import IOrderRepository from '../IOrderRepository';

class FakeOrderRepository implements IOrderRepository {
    private orders: Order[] = [];

    public async create(data: ICreateOrderDTO): Promise<Order> {
        const order = new Order();

        const order_items = data.items.map(item => item);

        Object.assign(order, { id: uuid(), order_items }, data);

        this.orders.push(order);
        return order;
    }

    public async findById(id: string): Promise<Order | undefined> {
        throw new Error('Method not implemented.');
    }
}

export default FakeOrderRepository;

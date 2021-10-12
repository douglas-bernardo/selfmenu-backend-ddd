import { v4 as uuid } from 'uuid';

import ICreateOrderDTO from '@modules/order/dtos/ICreateOrderDTO';
import Order from '@modules/order/infra/typeorm/entities/Order';

import IFindAllOrdersDTO from '@modules/order/dtos/IFindAllOrdersDTO';
import IFindByIdOrderDTO from '@modules/order/dtos/IFindByIdOrderDTO';
import IOrderRepository from '../IOrderRepository';

class FakeOrderRepository implements IOrderRepository {
    private orders: Order[] = [];

    public async findAll({
        restaurant_id,
    }: IFindAllOrdersDTO): Promise<Order[]> {
        const findOrders = this.orders.filter(
            order => order.restaurant.id === restaurant_id,
        );

        return findOrders;
    }

    public async create(data: ICreateOrderDTO): Promise<Order> {
        const order = new Order();

        const order_items = data.items.map(item => item);

        Object.assign(
            order,
            { id: uuid(), restaurant_id: data.restaurant.id, order_items },
            data,
        );

        this.orders.push(order);
        return order;
    }

    public async findById({
        id,
        restaurant_id,
    }: IFindByIdOrderDTO): Promise<Order | undefined> {
        let findOrder: Order | undefined;

        if (restaurant_id) {
            findOrder = this.orders.find(
                order =>
                    order.id === id && order.restaurant_id === restaurant_id,
            );
        } else {
            findOrder = this.orders.find(order => order.id === id);
        }

        return findOrder;
    }
}

export default FakeOrderRepository;

import { v4 as uuid } from 'uuid';

import ICreateOrderDTO from '@modules/order/dtos/ICreateOrderDTO';
import Order from '@modules/order/infra/typeorm/entities/Order';

import { IFindAllOrdersByTableDTO } from '@modules/order/dtos/IFindAllOrdersByTableDTO';
import IFindByIdOrderDTO from '@modules/order/dtos/IFindByIdOrderDTO';
import { IFindAllByEstablishmentDTO } from '@modules/order/dtos/IFindAllByEstablishmentDTO';
import IOrderRepository from '../IOrderRepository';

class FakeOrderRepository implements IOrderRepository {
    private orders: Order[] = [];

    public async save(order: Order): Promise<Order> {
        const findIndex = this.orders.findIndex(
            findOrder => findOrder.id === order.id,
        );

        this.orders[findIndex] = order;
        return order;
    }

    public async findAllByTable({
        owner_id,
        table_id,
    }: IFindAllOrdersByTableDTO): Promise<Order[]> {
        let findOrders: Order[] = [];

        if (table_id) {
            findOrders = this.orders.filter(
                order =>
                    order.owner.id === owner_id && order.table.id === table_id,
            );
        } else {
            findOrders = this.orders.filter(
                order => order.owner.id === owner_id,
            );
        }

        return findOrders;
    }

    public async findAllByEstablishmentId({
        establishment_id,
    }: IFindAllByEstablishmentDTO): Promise<Order[]> {
        const findOrders = this.orders.filter(
            order => order.establishment_id === establishment_id,
        );

        return findOrders;
    }

    public async create(data: ICreateOrderDTO): Promise<Order> {
        const order = new Order();

        const order_products = data.products.map(item => item);

        Object.assign(
            order,
            {
                id: uuid(),
                establishment_id: data.establishment.id,
                order_products,
            },
            data,
        );

        this.orders.push(order);
        return order;
    }

    public async findById({
        id,
    }: IFindByIdOrderDTO): Promise<Order | undefined> {
        const findOrder = this.orders.find(order => order.id === id);

        return findOrder;
    }
}

export default FakeOrderRepository;

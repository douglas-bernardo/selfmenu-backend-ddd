import ICreateOrderDTO from '@modules/order/dtos/ICreateOrderDTO';
import IFindAllOrdersDTO from '@modules/order/dtos/IFindAllOrdersDTO';
import IFindByIdOrderDTO from '@modules/order/dtos/IFindByIdOrderDTO';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { getRepository, Repository } from 'typeorm';

import Order from '../entities/Order';

class OrdersRepository implements IOrderRepository {
    private ormRepository: Repository<Order>;

    constructor() {
        this.ormRepository = getRepository(Order);
    }

    public async findAll({
        establishment_id,
    }: IFindAllOrdersDTO): Promise<Order[]> {
        const findOrders = await this.ormRepository.find({
            where: {
                establishment_id,
            },
        });

        return findOrders;
    }

    public async create({
        token,
        status_order_id,
        products,
        establishment,
        table,
        waiter,
        owner,
    }: ICreateOrderDTO): Promise<Order> {
        const order = this.ormRepository.create({
            token,
            status_order_id,
            establishment,
            waiter,
            table,
            owner,
            order_products: products,
        });

        await this.ormRepository.save(order);

        return order;
    }

    public async findById({
        id,
        establishment_id,
    }: IFindByIdOrderDTO): Promise<Order | undefined> {
        let findOrder: Order | undefined;

        if (establishment_id) {
            findOrder = await this.ormRepository.findOne({
                where: {
                    id,
                    establishment_id,
                },
                relations: ['order_products', 'table'],
            });
        } else {
            findOrder = await this.ormRepository.findOne(id);
        }

        return findOrder;
    }
}

export default OrdersRepository;

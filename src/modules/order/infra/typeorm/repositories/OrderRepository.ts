import ICreateOrderDTO from '@modules/order/dtos/ICreateOrderDTO';
import { IFindAllByEstablishmentDTO } from '@modules/order/dtos/IFindAllByEstablishmentDTO';
import { IFindAllOrdersByTableDTO } from '@modules/order/dtos/IFindAllOrdersByTableDTO';
import IFindByIdOrderDTO from '@modules/order/dtos/IFindByIdOrderDTO';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { getRepository, In, Repository } from 'typeorm';

import Order from '../entities/Order';

class OrdersRepository implements IOrderRepository {
    private ormRepository: Repository<Order>;

    constructor() {
        this.ormRepository = getRepository(Order);
    }

    public async findAllByTable({
        owner_id,
        table_id,
        table_token,
    }: IFindAllOrdersByTableDTO): Promise<Order[]> {
        let findOrders: Order[] = [];

        if (table_id && table_token) {
            findOrders = await this.ormRepository.find({
                where: {
                    owner_id,
                    table_id,
                    table_token,
                    status_order_id: In([1, 2, 3, 4, 5]),
                },
                relations: ['order_products', 'status_order'],
            });
        } else {
            findOrders = await this.ormRepository.find({
                where: {
                    owner_id,
                },
                relations: ['order_products', 'table'],
            });
        }

        return findOrders;
    }

    public async findAllByEstablishmentId({
        establishment_id,
        status_order_id,
    }: IFindAllByEstablishmentDTO): Promise<Order[]> {
        let findOrders: Order[] = [];

        if (status_order_id) {
            findOrders = await this.ormRepository.find({
                where: {
                    establishment_id,
                    status_order_id: In(status_order_id),
                },
                relations: ['order_products', 'table'],
            });
        } else {
            findOrders = await this.ormRepository.find({
                where: {
                    establishment_id,
                },
                relations: ['order_products'],
            });
        }

        return findOrders;
    }

    public async create({
        table_token,
        customer_name,
        status_order_id,
        products,
        establishment,
        table_id,
        waiter,
        owner,
    }: ICreateOrderDTO): Promise<Order> {
        const order = this.ormRepository.create({
            table_token,
            customer_name,
            status_order_id,
            establishment,
            waiter,
            table_id,
            owner,
            order_products: products,
        });

        await this.ormRepository.save(order);

        return order;
    }

    public async findById({
        id,
    }: IFindByIdOrderDTO): Promise<Order | undefined> {
        const findOrder = await this.ormRepository.findOne(id, {
            relations: ['order_products', 'status_order'],
        });

        return findOrder;
    }

    public async save(order: Order): Promise<Order> {
        return this.ormRepository.save(order);
    }
}

export default OrdersRepository;

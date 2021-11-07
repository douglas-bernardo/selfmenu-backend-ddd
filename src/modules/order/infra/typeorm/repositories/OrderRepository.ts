import ICreateOrderDTO from '@modules/order/dtos/ICreateOrderDTO';
import IFindAllOrdersByEstablishmentIdDTO from '@modules/order/dtos/IFindAllOrdersByEstablishmentIdDTO';
import IFindAllOrdersDTO from '@modules/order/dtos/IFindAllOrdersDTO';
import IFindByIdOrderDTO from '@modules/order/dtos/IFindByIdOrderDTO';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { getRepository, In, Repository } from 'typeorm';

import Order from '../entities/Order';

class OrdersRepository implements IOrderRepository {
    private ormRepository: Repository<Order>;

    constructor() {
        this.ormRepository = getRepository(Order);
    }

    public async findAll({
        owner_id,
        table_id,
        table_token,
    }: IFindAllOrdersDTO): Promise<Order[]> {
        let findOrders: Order[] = [];

        if (table_id && table_token) {
            findOrders = await this.ormRepository.find({
                where: {
                    owner_id,
                    table_id,
                    table_token,
                    status_order_id: In([1, 2, 3, 4]),
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
        owner_id,
        establishment_id,
    }: IFindAllOrdersByEstablishmentIdDTO): Promise<Order[]> {
        const findOrders = await this.ormRepository.find({
            where: {
                owner_id,
                establishment_id,
            },
            relations: ['order_products', 'table'],
        });

        return findOrders;
    }

    public async create({
        table_token,
        customer_name,
        status_order_id,
        products,
        establishment,
        table,
        waiter,
        owner,
    }: ICreateOrderDTO): Promise<Order> {
        const order = this.ormRepository.create({
            table_token,
            customer_name,
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
                relations: ['order_products', 'status_order'],
            });
        } else {
            findOrder = await this.ormRepository.findOne(id, {
                relations: ['order_products', 'status_order'],
            });
        }

        return findOrder;
    }

    public async save(order: Order): Promise<Order> {
        return this.ormRepository.save(order);
    }
}

export default OrdersRepository;

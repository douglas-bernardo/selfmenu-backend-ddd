import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IItemRepository from '@modules/item/repositories/IItemRepository';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';
import ITableRepository from '@modules/table/repositories/ITableRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IOrderRepository from '../repositories/IOrderRepository';
import Order from '../infra/typeorm/entities/Order';

interface IItems {
    id: string;
    quantity: number;
}

interface IRequest {
    owner_id: string;
    restaurant_id: string;
    waiter_id: string;
    table_id: string;
    items: IItems[];
}

@injectable()
class CreateOrderService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,

        @inject('TableRepository')
        private tableRepository: ITableRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,

        @inject('ItemRepository')
        private itemRepository: IItemRepository,

        @inject('OrderRepository')
        private orderRepository: IOrderRepository,
    ) {}

    public async execute({
        owner_id,
        restaurant_id,
        table_id,
        waiter_id,
        items,
    }: IRequest): Promise<Order> {
        const user = await this.usersRepository.findById(owner_id);

        if (!user) {
            throw new AppError('User account not found');
        }

        const restaurantExist = await this.restaurantRepository.findById({
            restaurant_id,
            owner_id,
        });

        if (!restaurantExist) {
            throw new AppError('Cannot find any restaurant with the given id');
        }

        const tableExist = await this.tableRepository.findById({
            restaurant_id,
            table_id,
        });

        if (!tableExist) {
            throw new AppError('Cannot find any table with the given id');
        }

        const waiterExist = await this.waiterRepository.findById({
            waiter_id,
            owner_id,
        });

        if (!waiterExist) {
            throw new AppError('Cannot find any waiter with the given id');
        }

        const existentProducts = await this.itemRepository.findAllById(
            items,
            owner_id,
        );

        if (!existentProducts.length) {
            throw new AppError('Cannot find any products with the given ids');
        }

        const existentProductsIds = existentProducts.map(product => product.id);

        const checkInexistentProducts = items.filter(
            item => !existentProductsIds.includes(item.id),
        );

        if (checkInexistentProducts.length) {
            throw new AppError(
                `Could not find product ${checkInexistentProducts[0].id}`,
            );
        }

        const findProductsWithNoQuantityAvailable = items.filter(
            item =>
                existentProducts.filter(p => p.id === item.id)[0].quantity <
                item.quantity,
        );

        if (findProductsWithNoQuantityAvailable.length) {
            throw new AppError(
                `The quantity ${findProductsWithNoQuantityAvailable[0].quantity}
          id not available for ${findProductsWithNoQuantityAvailable[0].id}`,
            );
        }

        const serializeItems = items.map(item => ({
            item_id: item.id,
            quantity: item.quantity,
            price: existentProducts.filter(p => p.id === item.id)[0].price,
        }));

        const order = await this.orderRepository.create({
            status_order_id: 1,
            restaurant: restaurantExist,
            table: tableExist,
            waiter: waiterExist,
            items: serializeItems,
        });

        const { order_items } = order;

        const orderedItemsQuantity = order_items.map(item => ({
            id: item.item_id,
            quantity:
                existentProducts.filter(p => p.id === item.item_id)[0]
                    .quantity - item.quantity,
        }));

        await this.itemRepository.updateQuantity(orderedItemsQuantity);

        return order;
    }
}

export default CreateOrderService;

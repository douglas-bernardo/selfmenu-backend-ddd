import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductRepository from '@modules/product/repositories/IProductRepository';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import IWaiterRepository from '@modules/waiter/repositories/IWaiterRepository';
import ITableRepository from '@modules/table/repositories/ITableRepository';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IOrderRepository from '../repositories/IOrderRepository';
import Order from '../infra/typeorm/entities/Order';

interface IProducts {
    id: string;
    quantity: number;
    details?: string;
}

interface IRequest {
    owner_id: string;
    table_id: string;
    table_token: string;
    customer_name: string;
    establishment_id: string;
    products: IProducts[];
}

@injectable()
class CreateOrderService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,

        @inject('TableRepository')
        private tableRepository: ITableRepository,

        @inject('WaiterRepository')
        private waiterRepository: IWaiterRepository,

        @inject('ProductRepository')
        private productRepository: IProductRepository,

        @inject('OrderRepository')
        private orderRepository: IOrderRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
    ) {}

    public async execute({
        owner_id,
        table_id,
        table_token,
        customer_name,
        establishment_id,
        products,
    }: IRequest): Promise<Order> {
        const table = await this.tableRepository.findByToken({
            table_id,
            table_token,
        });

        if (!table) {
            throw new AppError('Token inválido');
        }

        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Account account not found');
        }

        const establishmentExist = await this.establishmentRepository.findById({
            establishment_id,
            owner_id: account.id,
        });

        if (!establishmentExist) {
            throw new AppError(
                'Cannot find any establishment with the given id',
            );
        }

        const waiterExist = await this.waiterRepository.findById({
            waiter_id: table.waiter_id,
            owner_id: account.id,
        });

        if (!waiterExist) {
            throw new AppError('Cannot find any waiter with the given id');
        }
        // [3,4,8,9]
        const existentProducts = await this.productRepository.findAllById(
            products,
            account.id,
        );

        if (!existentProducts.length) {
            throw new AppError('Cannot find any products with the given ids');
        }

        const existentProductsIds = existentProducts.map(product => product.id);

        const checkInexistentProducts = products.filter(
            product => !existentProductsIds.includes(product.id),
        );

        // [9]
        if (checkInexistentProducts.length) {
            throw new AppError(
                `Could not find product ${checkInexistentProducts[0].id}`,
            );
        }

        const findProductsWithNoQuantityAvailable = products.filter(
            product =>
                existentProducts.filter(p => p.id === product.id)[0].quantity <
                product.quantity,
        );

        if (findProductsWithNoQuantityAvailable.length) {
            throw new AppError(
                `The quantity ${findProductsWithNoQuantityAvailable[0].quantity}
          id not available for ${findProductsWithNoQuantityAvailable[0].id}`,
            );
        }

        const serializeProducts = products.map(product => ({
            product_id: product.id,
            quantity: product.quantity,
            price: existentProducts.filter(p => p.id === product.id)[0].price,
            details: product.details,
        }));

        const order = await this.orderRepository.create({
            table_token,
            customer_name,
            status_order_id: 1,
            establishment: establishmentExist,
            owner: account,
            table_id: table.id,
            waiter: waiterExist,
            products: serializeProducts,
        });

        const { order_products } = order;

        const orderedProductsQuantity = order_products.map(product => ({
            id: product.product_id,
            quantity:
                existentProducts.filter(p => p.id === product.product_id)[0]
                    .quantity - product.quantity,
        }));

        await this.productRepository.updateQuantity(orderedProductsQuantity);

        await this.notificationsRepository.create({
            content: `Novo pedido realizado em ${establishmentExist.name} | mesa: ${table.number}`,
            recipient_id: account.id,
            establishment_id: establishmentExist.id,
        });

        return order;
    }
}

export default CreateOrderService;

import CreateOrderService from '@modules/order/services/CreateOrderService';
import ListOrdersService from '@modules/order/services/ListOrdersService';
import ShowOrderService from '@modules/order/services/ShowOrderService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class OrderController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.account;
        const { table_id, table_token } = request.query;

        const listOrders = container.resolve(ListOrdersService);

        const orders = await listOrders.execute({
            owner_id: id,
            table_id: String(table_id),
            table_token: String(table_token),
        });

        return response.json(orders);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.account;
        const { table_token, customer_name, establishment_id, products } =
            request.body;

        const createOrder = container.resolve(CreateOrderService);

        const order = await createOrder.execute({
            owner_id: id,
            table_token,
            customer_name,
            establishment_id,
            products,
        });

        return response.json(classToClass(order));
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const findOrder = container.resolve(ShowOrderService);

        const order = await findOrder.execute({
            id,
        });

        return response.json(order);
    }
}

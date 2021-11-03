import CreateOrderService from '@modules/order/services/CreateOrderService';
import ListOrdersService from '@modules/order/services/ListOrdersService';
import ShowOrderService from '@modules/order/services/ShowOrderService';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class OrderController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.account;
        const { table_id } = request.query;

        const listOrders = container.resolve(ListOrdersService);

        const orders = await listOrders.execute({
            owner_id: id,
            table_id: String(table_id),
        });

        return response.json(orders);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.account;
        const { table_token, costumer_name, establishment_id, products } =
            request.body;

        const createOrder = container.resolve(CreateOrderService);

        const order = await createOrder.execute({
            owner_id: id,
            table_token,
            costumer_name,
            establishment_id,
            products,
        });

        return response.json(order);
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

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
        const { restaurant_id } = request.params;

        const listOrders = container.resolve(ListOrdersService);

        const orders = await listOrders.execute({ restaurant_id });

        return response.json(orders);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { table_token, items } = request.body;

        const createOrder = container.resolve(CreateOrderService);

        const order = await createOrder.execute({
            table_token,
            items,
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

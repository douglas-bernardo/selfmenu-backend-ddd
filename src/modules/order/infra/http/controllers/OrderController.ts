import CreateOrderService from '@modules/order/services/CreateOrderService';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class OrderController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { token_table, items } = request.body;

        const createOrder = container.resolve(CreateOrderService);

        const order = await createOrder.execute({
            token_table,
            items,
        });

        return response.json(order);
    }
}

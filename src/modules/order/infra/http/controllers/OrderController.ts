import CreateOrderService from '@modules/order/services/CreateOrderService';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class OrderController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { owner_id } = request.params;
        const { restaurant_id, waiter_id, table_id, items } = request.body;

        const createOrder = container.resolve(CreateOrderService);

        const order = await createOrder.execute({
            owner_id,
            restaurant_id,
            waiter_id,
            table_id,
            items,
        });

        return response.json(order);
    }
}

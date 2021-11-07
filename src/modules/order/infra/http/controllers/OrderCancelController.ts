import OrderCancelService from '@modules/order/services/OrderCancelService';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class OrderCancelController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const orderCancelService = container.resolve(OrderCancelService);

        await orderCancelService.execute({
            order_id: id,
        });

        return response.status(204).json();
    }
}

import UpdateStatusOrderService from '@modules/order/services/UpdateStatusOrderService';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class UpdateOrderStatusController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const { status_order_id } = request.body;

        const updateStatusOrderService = container.resolve(
            UpdateStatusOrderService,
        );

        await updateStatusOrderService.execute({
            order_id: id,
            status_order_id,
        });

        return response.status(204).json();
    }
}

import RemoveOrderProductService from '@modules/order/services/RemoveOrderProductService';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class OrderProductController {
    public async delete(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const { order_product_id } = request.body;

        const removeOrderProductService = container.resolve(
            RemoveOrderProductService,
        );

        await removeOrderProductService.execute({
            order_id: id,
            order_product_id,
        });

        return response.status(204).json();
    }
}

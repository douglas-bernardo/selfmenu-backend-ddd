import listOrdersByEstablishmentService from '@modules/order/services/ListOrdersByEstablishmentService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';

import { container } from 'tsyringe';

export default class ListEstablishmentOrdersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.account;
        const { establishment_id, status_order_id } = request.query;

        const listOrders = container.resolve(listOrdersByEstablishmentService);

        const orders = await listOrders.execute({
            owner_id: id,
            establishment_id: String(establishment_id),
            status_order_id: status_order_id?.toString(),
        });

        return response.json(classToClass(orders));
    }
}

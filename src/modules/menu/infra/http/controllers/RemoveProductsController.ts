import { Request, Response } from 'express';
import { container } from 'tsyringe';

import RemoveProductsMenuService from '@modules/menu/services/RemoveProductsMenuService';

export default class RemoveProductsController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const account_id = request.account.id;
        const { products } = request.body;

        const removeProducts = container.resolve(RemoveProductsMenuService);

        const restaurant = await removeProducts.execute({
            account_id,
            menu_id: id,
            products,
        });

        return response.json(restaurant);
    }
}

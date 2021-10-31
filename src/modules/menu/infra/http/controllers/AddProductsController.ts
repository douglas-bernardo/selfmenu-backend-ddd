import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddProductsMenuService from '@modules/menu/services/AddProductsMenuService';

export default class AddProductsController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const account_id = request.account.id;
        const { products } = request.body;

        const addProducts = container.resolve(AddProductsMenuService);

        const restaurant = await addProducts.execute({
            account_id,
            menu_id: id,
            products,
        });

        return response.json(restaurant);
    }
}

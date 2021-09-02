import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddItemsMenuService from '@modules/menu/services/AddItemsMenuService';

export default class AddItemsController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const user_id = request.user.id;
        const { items } = request.body;

        const addItems = container.resolve(AddItemsMenuService);

        const restaurant = await addItems.execute({
            user_id,
            menu_id: id,
            items,
        });

        return response.json(restaurant);
    }
}

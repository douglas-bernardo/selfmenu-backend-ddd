import { Request, Response } from 'express';
import { container } from 'tsyringe';

import RemoveItemsMenuService from '@modules/menu/services/RemoveItemsMenuService';

export default class RemoveItemsController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const user_id = request.user.id;
        const { items } = request.body;

        const removeItems = container.resolve(RemoveItemsMenuService);

        const restaurant = await removeItems.execute({
            user_id,
            menu_id: id,
            items,
        });

        return response.json(restaurant);
    }
}

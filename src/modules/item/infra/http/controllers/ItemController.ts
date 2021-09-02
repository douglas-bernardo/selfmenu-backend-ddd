import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateItemService from '@modules/item/services/CreateItemService';
import ListItemsService from '@modules/item/services/ListItemsService';

export default class ItemController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const listItems = container.resolve(ListItemsService);

        const items = await listItems.execute({ user_id });
        return response.json(items);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name, description, category_id, price, quantity } =
            request.body;

        const requestImages = request.files as Express.Multer.File[];

        const createItemService = container.resolve(CreateItemService);

        const restaurant = await createItemService.execute({
            user_id,
            name,
            description,
            price,
            category_id,
            quantity,
            images: requestImages,
        });

        return response.json(restaurant);
    }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateItemService from '@modules/item/services/CreateItemService';
import ListItemsService from '@modules/item/services/ListItemsService';
import ShowItemService from '@modules/item/services/ShowItemService';

export default class ItemController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const showItems = container.resolve(ListItemsService);

        const items = await showItems.execute({ user_id });
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

    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { id } = request.params;
        const showItem = container.resolve(ShowItemService);

        const item = await showItem.execute({
            item_id: id,
            owner_id: user_id,
        });

        return response.json(item);
    }
}

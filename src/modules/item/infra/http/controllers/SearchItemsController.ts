import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import SearchItemsService from '@modules/item/services/SearchItemsService';

export default class SearchItemsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const owner_id = request.user.id;
        const { name, category_id } = request.query;
        const searchItems = container.resolve(SearchItemsService);
        console.log(category_id);
        const item = await searchItems.execute({
            name: String(name),
            category_id: Number(category_id),
            owner_id,
        });

        return response.json(classToClass(item));
    }
}

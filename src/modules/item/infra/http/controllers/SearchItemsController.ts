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
        const { name } = request.query;
        const searchItems = container.resolve(SearchItemsService);

        const item = await searchItems.execute({
            param: String(name),
            owner_id,
        });

        return response.json(classToClass(item));
    }
}

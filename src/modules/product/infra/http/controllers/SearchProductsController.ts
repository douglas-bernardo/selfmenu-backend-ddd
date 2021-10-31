import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import SearchProductsService from '@modules/product/services/SearchProductsService';

export default class SearchProductsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const owner_id = request.account.id;
        const { name, category_id } = request.query;
        const searchProducts = container.resolve(SearchProductsService);
        const product = await searchProducts.execute({
            name: String(name),
            category_id: Number(category_id),
            owner_id,
        });

        return response.json(classToClass(product));
    }
}

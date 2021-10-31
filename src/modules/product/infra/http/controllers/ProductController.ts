import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateProductService from '@modules/product/services/CreateProductService';
import ListProductsService from '@modules/product/services/ListProductService';
import ShowProductService from '@modules/product/services/ShowProductService';

export default class ProductController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { category } = request.query;
        const showProducts = container.resolve(ListProductsService);

        const products = await showProducts.execute({
            owner_id: account_id,
            category_id: Number(category),
        });
        return response.json(classToClass(products));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { name, description, category_id, price, quantity } =
            request.body;

        const createProductService = container.resolve(CreateProductService);

        const product = await createProductService.execute({
            account_id,
            name,
            description,
            price,
            category_id,
            quantity,
            photo: request.file?.filename,
        });

        return response.json(classToClass(product));
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;
        const showProduct = container.resolve(ShowProductService);

        const product = await showProduct.execute({
            product_id: id,
            owner_id: account_id,
        });

        return response.json(classToClass(product));
    }
}

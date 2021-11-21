import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateProductService from '@modules/product/services/CreateProductService';
import ListProductsService from '@modules/product/services/ListProductService';
import ShowProductService from '@modules/product/services/ShowProductService';
import UpdateProductService from '@modules/product/services/UpdateProductService';

export default class ProductController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { category, offset, limit } = request.query;
        const showProducts = container.resolve(ListProductsService);

        const { products, total } = await showProducts.execute({
            owner_id: account_id,
            category_id: Number(category),
            offset: Number(offset),
            limit: Number(limit),
        });

        response.setHeader('x-total-count', total);
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

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;
        const { name, description, category_id, price, quantity, available } =
            request.body;

        const updateProductService = container.resolve(UpdateProductService);

        const product = await updateProductService.execute({
            owner_id: account_id,
            product_id: id,
            name,
            description,
            price,
            category_id,
            quantity,
            available,
            photo: request.file?.filename,
        });

        return response.json(classToClass(product));
    }
}

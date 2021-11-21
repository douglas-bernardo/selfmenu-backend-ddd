import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCategoryService from '@modules/product/services/CreateCategoryService';
import ListCategoriesService from '@modules/product/services/ListCategoriesService';
import ShowCategoryService from '@modules/product/services/ShowCategoryService';
import UpdateCategoryService from '@modules/product/services/UpdateCategoryService';

export default class CategoryController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const owner_id = request.account.id;
        const listCategories = container.resolve(ListCategoriesService);

        const categories = await listCategories.execute({ owner_id });

        return response.json(classToClass(categories));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { name } = request.body;

        const createCategory = container.resolve(CreateCategoryService);

        const category = await createCategory.execute({
            name,
            owner_id: account_id,
            image_cover: request.file?.filename,
        });

        return response.json(classToClass(category));
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;
        const showCategory = container.resolve(ShowCategoryService);

        const category = await showCategory.execute({
            id,
            owner_id: account_id,
        });

        return response.json(classToClass(category));
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;
        const { name, active } = request.body;

        const updateCategoryService = container.resolve(UpdateCategoryService);

        const category = await updateCategoryService.execute({
            category_id: Number(id),
            name,
            owner_id: account_id,
            active,
            image_cover: request.file?.filename,
        });

        return response.json(classToClass(category));
    }
}

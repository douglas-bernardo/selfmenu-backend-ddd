import CreateCategoryService from '@modules/item/services/CreateCategoryService';
import ListCategoriesService from '@modules/item/services/ListCategoriesService';
import ShowCategoryService from '@modules/item/services/ShowCategoryService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CategoryController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const listCategories = container.resolve(ListCategoriesService);

        const categories = await listCategories.execute({ owner_id: user_id });

        return response.json(categories);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name } = request.body;

        const createCategory = container.resolve(CreateCategoryService);

        const category = await createCategory.execute({
            name,
            owner_id: user_id,
        });

        return response.json(category);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { id } = request.params;
        const showCategory = container.resolve(ShowCategoryService);

        const item = await showCategory.execute({
            id,
            owner_id: user_id,
        });

        return response.json(item);
    }
}

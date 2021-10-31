import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateMenuService from '@modules/menu/services/CreateMenuService';
import ShowMenuService from '@modules/menu/services/ShowMenuService';
import ListMenuService from '@modules/menu/services/ListMenuService';

export default class MenuController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const listMenuService = container.resolve(ListMenuService);

        const menus = await listMenuService.execute({ account_id });
        return response.json(menus);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showMenu = container.resolve(ShowMenuService);

        const menu = await showMenu.execute({ id });

        return response.json(menu);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { title, description, establishment_id, products } = request.body;

        const createMenuService = container.resolve(CreateMenuService);

        const establishment = await createMenuService.execute({
            account_id,
            title,
            description,
            establishment_id,
            products,
        });

        return response.json(establishment);
    }
}

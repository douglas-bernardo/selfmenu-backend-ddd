import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTableService from '@modules/table/services/CreateTableService';

export default class TableController {
    // public async index(
    //     request: Request,
    //     response: Response,
    // ): Promise<Response> {
    //     const user_id = request.user.id;
    //     const listTable = container.resolve(ListMenuService);

    //     const menus = await listTable.execute({ user_id });
    //     return response.json(menus);
    // }

    // public async show(request: Request, response: Response): Promise<Response> {
    //     const { id } = request.params;

    //     const showMenu = container.resolve(ShowMenuService);

    //     const menu = await showMenu.execute({ id });

    //     return response.json(menu);
    // }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { code, capacity, restaurant_id, waiter_id } = request.body;

        const createTableService = container.resolve(CreateTableService);

        const table = await createTableService.execute({
            code,
            capacity,
            restaurant_id,
            waiter_id,
            owner_id: user_id,
        });

        return response.json(table);
    }
}

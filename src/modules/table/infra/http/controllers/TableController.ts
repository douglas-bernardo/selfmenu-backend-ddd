import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTableService from '@modules/table/services/CreateTableService';
import ListTablesServices from '@modules/table/services/ListTablesService';

export default class TableController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id: restaurant_id } = request.params;
        const listTables = container.resolve(ListTablesServices);

        const restaurants = await listTables.execute({ restaurant_id });
        return response.json(restaurants);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { id: restaurant_id } = request.params;
        const { code, capacity, waiter_id } = request.body;

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

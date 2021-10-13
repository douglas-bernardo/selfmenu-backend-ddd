import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTableService from '@modules/table/services/CreateTableService';
import ListTablesServices from '@modules/table/services/ListTablesService';
import ShowTableService from '@modules/table/services/ShowTableService';
import { classToClass } from 'class-transformer';

export default class TableController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { restaurant_id } = request.params;
        const showTable = container.resolve(ListTablesServices);

        const tables = await showTable.execute({ restaurant_id });
        return response.json(classToClass(tables));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { restaurant_id } = request.params;
        const { capacity, waiter_id } = request.body;

        const createTableService = container.resolve(CreateTableService);

        const table = await createTableService.execute({
            capacity,
            restaurant_id,
            waiter_id,
            owner_id: user_id,
        });

        return response.json(classToClass(table));
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { restaurant_id, id } = request.params;
        const showTable = container.resolve(ShowTableService);

        const table = await showTable.execute({ id, restaurant_id });
        return response.json(table);
    }
}

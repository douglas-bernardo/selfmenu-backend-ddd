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
        const account_id = request.account.id;
        const showTable = container.resolve(ListTablesServices);

        const tables = await showTable.execute({ owner_id: account_id });
        return response.json(classToClass(tables));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { capacity, establishment_id, waiter_id } = request.body;

        const createTableService = container.resolve(CreateTableService);

        const table = await createTableService.execute({
            capacity,
            establishment_id,
            waiter_id,
            owner_id: account_id,
        });

        return response.json(table);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const showTable = container.resolve(ShowTableService);

        const table = await showTable.execute({ table_id: id });
        return response.json(table);
    }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateTableService from '@modules/table/services/AuthenticateTableService';

export default class SessionsTableController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;
        const authenticateTable = container.resolve(AuthenticateTableService);

        const table = await authenticateTable.execute({ id });
        return response.json(table);
    }
}

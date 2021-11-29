import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CloseTableService from '@modules/table/services/CloseTableService';

export default class CloseTableController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;

        const closeTableService = container.resolve(CloseTableService);

        await closeTableService.execute({
            owner_id: account_id,
            table_id: id,
        });

        return response.status(204).json();
    }
}

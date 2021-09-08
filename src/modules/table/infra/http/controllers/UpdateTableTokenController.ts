import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateTableTokenService from '@modules/table/services/UpdateTableTokenService';

export default class UpdateTableTokenController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { table_code, restaurant_id } = request.body;

        const updateTableTokenService = container.resolve(
            UpdateTableTokenService,
        );

        const { table, token } = await updateTableTokenService.execute({
            table_code,
            restaurant_id,
        });

        return response.json({ table, token });
    }
}

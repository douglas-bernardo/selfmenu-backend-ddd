import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateTableTokenService from '@modules/table/services/UpdateTableTokenService';

export default class UpdateTableTokenController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { restaurant_id } = request.params;
        const { table_number } = request.body;

        const updateTableTokenService = container.resolve(
            UpdateTableTokenService,
        );

        const { number, token } = await updateTableTokenService.execute({
            table_number,
            restaurant_id,
        });

        return response.json({ number, token });
    }
}

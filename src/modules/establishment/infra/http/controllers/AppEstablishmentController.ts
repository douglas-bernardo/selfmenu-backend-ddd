import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowEstablishmentService from '@modules/establishment/services/ShowEstablishmentService';

export default class AppEstablishmentController {
    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showEstablishment = container.resolve(ShowEstablishmentService);

        const establishment = await showEstablishment.execute({
            id,
        });

        return response.json(establishment);
    }
}

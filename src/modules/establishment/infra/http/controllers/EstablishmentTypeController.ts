import ListEstablishmentTypesService from '@modules/establishment/services/ListEstablishmentTypesService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class EstablishmentTypeController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listEstablishmentTypesService = container.resolve(
            ListEstablishmentTypesService,
        );

        const types = await listEstablishmentTypesService.execute();

        return response.json(types);
    }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateEstablishmentService from '@modules/establishment/services/CreateEstablishmentService';
import ListEstablishmentsService from '@modules/establishment/services/ListEstablishmentsService';
import ShowEstablishmentService from '@modules/establishment/services/ShowEstablishmentService';

export default class EstablishmentController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const listEstablishments = container.resolve(ListEstablishmentsService);

        const menus = await listEstablishments.execute({
            owner_id: account_id,
        });
        return response.json(menus);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;

        const { name, cnpj, description, establishment_type_id } = request.body;

        const createEstablishmentService = container.resolve(
            CreateEstablishmentService,
        );

        const establishment = await createEstablishmentService.execute({
            name,
            cnpj,
            description,
            establishment_type_id,
            account_id,
        });

        return response.json(establishment);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;

        const showEstablishment = container.resolve(ShowEstablishmentService);

        const establishment = await showEstablishment.execute({
            id,
            owner_id: account_id,
        });

        return response.json(establishment);
    }
}

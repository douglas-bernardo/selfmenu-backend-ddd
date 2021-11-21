import CreateWaiterService from '@modules/waiter/services/CreateWaiterService';
import ListWaitersService from '@modules/waiter/services/ListWaitersService';
import ShowWaiterService from '@modules/waiter/services/ShowWaiterService';
import UpdateWaiterService from '@modules/waiter/services/UpdateWaiterService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class WaiterController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { offset, limit } = request.query;

        const listWaiters = container.resolve(ListWaitersService);

        const { waiters, total } = await listWaiters.execute({
            owner_id: account_id,
            offset: Number(offset),
            limit: Number(limit),
        });

        response.setHeader('x-total-count', total);
        return response.json(classToClass(waiters));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { name, cpf, username, password, establishment_id } =
            request.body;

        const createWaiterService = container.resolve(CreateWaiterService);

        const waiter = await createWaiterService.execute({
            name,
            cpf,
            username,
            password,
            owner_id: account_id,
            establishment_id,
            avatar: request.file?.filename,
        });

        return response.json(classToClass(waiter));
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;

        const showWaiter = container.resolve(ShowWaiterService);

        const waiter = await showWaiter.execute({
            id,
            owner_id: account_id,
        });

        return response.json(classToClass(waiter));
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const account_id = request.account.id;
        const { id } = request.params;
        const { name, cpf, username, password, establishment_id, active } =
            request.body;

        const updateWaiterService = container.resolve(UpdateWaiterService);

        const waiter = await updateWaiterService.execute({
            waiter_id: id,
            name,
            cpf,
            username,
            password,
            owner_id: account_id,
            establishment_id,
            avatar: request.file?.filename,
            active,
        });

        return response.json(classToClass(waiter));
    }
}

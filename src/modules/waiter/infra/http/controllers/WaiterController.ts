import CreateWaiterService from '@modules/waiter/services/CreateWaiterService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class WaiterController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { name, cpf, username, password, restaurant_id } = request.body;

        const createWaiterService = container.resolve(CreateWaiterService);

        const restaurant = await createWaiterService.execute({
            name,
            cpf,
            username,
            password,
            owner_id: user_id,
            restaurant_id,
        });

        return response.json(restaurant);
    }
}

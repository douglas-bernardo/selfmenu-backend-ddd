import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRestaurantService from '@modules/restaurant/services/CreateRestaurantService';

export default class RestaurantController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, cnpj, description, restaurant_type_id, account_id } =
            request.body;

        const createRestaurantService = container.resolve(
            CreateRestaurantService,
        );

        const restaurant = await createRestaurantService.execute({
            name,
            cnpj,
            description,
            restaurant_type_id,
            account_id,
        });

        return response.json(restaurant);
    }
}

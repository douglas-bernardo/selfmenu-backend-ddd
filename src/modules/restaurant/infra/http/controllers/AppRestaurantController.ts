import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowRestaurantService from '@modules/restaurant/services/ShowRestaurantService';

export default class AppRestaurantController {
    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showRestaurant = container.resolve(ShowRestaurantService);

        const restaurant = await showRestaurant.execute({
            id,
        });

        return response.json(restaurant);
    }
}

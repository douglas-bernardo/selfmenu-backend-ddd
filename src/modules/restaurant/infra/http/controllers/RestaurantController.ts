import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRestaurantService from '@modules/restaurant/services/CreateRestaurantService';
import ListRestaurantsService from '@modules/restaurant/services/ListRestaurantsService';
import ShowRestaurantService from '@modules/restaurant/services/ShowRestaurantService';

export default class RestaurantController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const listRestaurants = container.resolve(ListRestaurantsService);

        const menus = await listRestaurants.execute({ owner_id: user_id });
        return response.json(menus);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;

        const { name, cnpj, description, restaurant_type_id } = request.body;

        const createRestaurantService = container.resolve(
            CreateRestaurantService,
        );

        const restaurant = await createRestaurantService.execute({
            name,
            cnpj,
            description,
            restaurant_type_id,
            user_id,
        });

        return response.json(restaurant);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { id } = request.params;

        const showRestaurant = container.resolve(ShowRestaurantService);

        const restaurant = await showRestaurant.execute({
            id,
            owner_id: user_id,
        });

        return response.json(restaurant);
    }
}

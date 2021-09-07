import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRestaurantRepository from '@modules/restaurant/repositories/IRestaurantRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IItemRepository from '@modules/item/repositories/IItemRepository';
import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/entities/Menu';

interface IItem {
    item_id: string;
}

interface IRequestItem {
    id: string;
}

interface IRequest {
    user_id: string;
    title: string;
    description?: string;
    restaurant_id: string;
    items: IRequestItem[];
}

@injectable()
class CreateMenuService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('ItemRepository')
        private itemRepository: IItemRepository,

        @inject('RestaurantRepository')
        private restaurantRepository: IRestaurantRepository,

        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute({
        user_id,
        title,
        description,
        restaurant_id,
        items,
    }: IRequest): Promise<Menu> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User account not found');
        }

        if (user.plan.name === 'Free') {
            const hasMenuCreated = await this.menuRepository.findAll({
                owner_id: user.id,
            });

            if (hasMenuCreated.length > 0) {
                throw new AppError(
                    'Only Premium users can register more than one menu by account.',
                );
            }
        }

        const restaurant = await this.restaurantRepository.findById({
            restaurant_id,
            owner_id: user_id,
        });

        if (!restaurant) {
            throw new AppError('Restaurant not found');
        }

        if (!restaurant.active) {
            throw new AppError('Restaurant inactive. Not allowed.');
        }

        const menuTitleExists = await this.menuRepository.findByTitle(title);

        if (menuTitleExists) {
            throw new AppError('Menu title already used');
        }

        let serializeItems = {} as IItem[];
        if (items) {
            const existentItems = await this.itemRepository.findAllById(
                items,
                user_id,
            );

            if (!existentItems.length) {
                throw new AppError('Cannot find any items with the given ids');
            }

            const existentItemsIds = existentItems.map(item => item.id);

            const checkInexistentItems = items.filter(
                item => !existentItemsIds.includes(item.id),
            );

            if (checkInexistentItems.length) {
                throw new AppError(
                    `Could not find product ${checkInexistentItems[0].id}`,
                );
            }

            serializeItems = items.map(item => ({
                item_id: item.id,
            }));
        }

        const menu = this.menuRepository.create({
            title,
            description,
            owner_id: user.id,
            restaurant_id,
            items: serializeItems,
        });

        return menu;
    }
}

export default CreateMenuService;

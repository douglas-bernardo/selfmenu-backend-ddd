import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { getRepository, In } from 'typeorm';
import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/entities/Menu';
import MenuItem from '../infra/typeorm/entities/MenuItem';

interface IRequestItem {
    id: string;
}

interface IRequest {
    user_id: string;
    menu_id: string;
    items: IRequestItem[];
}

@injectable()
class RemoveItemsMenuService {
    constructor(
        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute({ user_id, menu_id, items }: IRequest): Promise<Menu> {
        const menu = await this.menuRepository.findById(menu_id, user_id);

        if (!menu) {
            throw new AppError('Menu not found');
        }

        menu.menu_item = menu.menu_item.filter(item => {
            return items.some(i => {
                return i.id !== item.item_id;
            });
        });

        const itemIds = items.map(item => item.id);
        const menuItemsRepository = getRepository(MenuItem);
        const itemsToDelete = await menuItemsRepository.find({
            where: {
                menu_id,
                item_id: In(itemIds),
            },
        });
        await menuItemsRepository.remove(itemsToDelete);

        return menu;
    }
}

export default RemoveItemsMenuService;

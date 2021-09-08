import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IItemRepository from '@modules/item/repositories/IItemRepository';
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
class AddItemsMenuService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('ItemRepository')
        private itemRepository: IItemRepository,

        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute({ user_id, menu_id, items }: IRequest): Promise<Menu> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        const menu = await this.menuRepository.findById(menu_id, user_id);

        if (!menu) {
            throw new AppError('Menu not found');
        }

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

        const nonDuplicates = items.filter(
            (elem, index, self) =>
                self.findIndex(t => {
                    return t.id === elem.id;
                }) === index,
        );

        const itemsNotIncludedInMenu = nonDuplicates.filter(item => {
            return menu.menu_item.every(i => i.item_id !== item.id);
        });

        itemsNotIncludedInMenu.forEach(item => {
            menu.menu_item.push({
                item_id: item.id,
                menu_id,
                active: true,
            } as MenuItem);
        });

        await this.menuRepository.save(menu);

        return menu;
    }
}

export default AddItemsMenuService;

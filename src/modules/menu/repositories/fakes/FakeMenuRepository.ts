import { v4 as uuid } from 'uuid';

import ICreateMenuDTO from '@modules/menu/dtos/ICreateMenuDTO';
import Menu from '@modules/menu/infra/typeorm/entities/Menu';
import IFindAllMenusDTO from '@modules/menu/dtos/IFindAllMenusDTO';
import IMenuRepository from '../IMenuRepository';

class FakeMenuRepository implements IMenuRepository {
    private menus: Menu[] = [];

    public async findAll({ owner_id }: IFindAllMenusDTO): Promise<Menu[]> {
        let { menus } = this;

        if (owner_id) {
            menus = this.menus.filter(menu => menu.owner_id === owner_id);
        }

        return menus;
    }

    public async findByTitle(
        title: string,
        owner_id?: string,
    ): Promise<Menu | undefined> {
        let findMenu: Menu | undefined;

        if (owner_id) {
            findMenu = this.menus.find(
                menu => menu.title === title && menu.owner_id === owner_id,
            );
        } else {
            findMenu = this.menus.find(menu => menu.title === title);
        }

        return findMenu;
    }

    public async findById(
        menu_id: string,
        owner_id?: string,
    ): Promise<Menu | undefined> {
        const findMenu = this.menus.find(menu => menu.id === menu_id);

        return findMenu;
    }

    public async create(data: ICreateMenuDTO): Promise<Menu> {
        const menu = new Menu();

        Object.assign(menu, { id: uuid() }, data);

        this.menus.push(menu);
        return menu;
    }

    public async save(menu: Menu): Promise<Menu> {
        const findIndex = this.menus.findIndex(
            findMenu => findMenu.id === menu.id,
        );

        this.menus[findIndex] = menu;
        return menu;
    }
}

export default FakeMenuRepository;

import ICreateMenuDTO from '@modules/menu/dtos/ICreateMenuDTO';
import IFindAllMenusDTO from '@modules/menu/dtos/IFindAllMenusDTO';
import Menu from '@modules/menu/infra/typeorm/entities/Menu';
import IMenuRepository from '@modules/menu/repositories/IMenuRepository';
import { getRepository, Repository } from 'typeorm';

class MenuRepository implements IMenuRepository {
    private ormRepository: Repository<Menu>;

    constructor() {
        this.ormRepository = getRepository(Menu);
    }

    public async findAll({ owner_id }: IFindAllMenusDTO): Promise<Menu[]> {
        let menus: Menu[] = [];

        if (owner_id) {
            menus = await this.ormRepository.find({
                where: {
                    owner_id,
                },
            });
        } else {
            menus = await this.ormRepository.find();
        }

        return menus;
    }

    public async findByTitle(
        title: string,
        owner_id?: string,
    ): Promise<Menu | undefined> {
        let findMenu: Menu | undefined;

        if (owner_id) {
            findMenu = await this.ormRepository.findOne({
                where: {
                    title,
                    owner_id,
                },
            });
        } else {
            findMenu = await this.ormRepository.findOne({
                where: {
                    title,
                },
            });
        }

        return findMenu;
    }

    public async findById(menu_id: string): Promise<Menu | undefined> {
        const menu = await this.ormRepository.findOne(menu_id, {
            relations: ['menu_item'],
        });

        return menu;
    }

    public async create({
        title,
        description,
        owner_id,
        restaurant_id,
        items,
    }: ICreateMenuDTO): Promise<Menu> {
        const menu = this.ormRepository.create({
            title,
            description,
            owner_id,
            restaurant_id,
            menu_item: items,
        });

        await this.ormRepository.save(menu);

        return menu;
    }

    public async save(menu: Menu): Promise<Menu> {
        return this.ormRepository.save(menu);
    }
}

export default MenuRepository;

import ICreateMenuDTO from '@modules/menu/dtos/ICreateMenuDTO';
import IFindAllMenusDTO from '../dtos/IFindAllMenusDTO';
import Menu from '../infra/typeorm/entities/Menu';

export default interface IMenuRepository {
    findAll(data?: IFindAllMenusDTO): Promise<Menu[]>;
    findById(menu_id: string, owner_id?: string): Promise<Menu | undefined>;
    findByTitle(title: string, owner_id?: string): Promise<Menu | undefined>;
    create(data: ICreateMenuDTO): Promise<Menu>;
    save(menu: Menu): Promise<Menu>;
}

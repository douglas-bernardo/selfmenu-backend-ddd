import ICreateItemDTO from '../dtos/ICreateItemDTO';
import IUpdateItemsQuantityDTO from '../dtos/IUpdateItemsQuantityDTO';
import Item from '../infra/typeorm/entities/Item';

interface IFindItems {
    id: string;
}

export default interface IItemRepository {
    findAll(owner_id?: string): Promise<Item[]>;
    findById(id: string): Promise<Item | undefined>;
    findByName(name: string): Promise<Item | undefined>;
    findAllById(items_ids: IFindItems[], owner_id?: string): Promise<Item[]>;
    create(data: ICreateItemDTO): Promise<Item>;
    save(item: Item): Promise<Item>;
    updateQuantity(items: IUpdateItemsQuantityDTO[]): Promise<Item[]>;
}

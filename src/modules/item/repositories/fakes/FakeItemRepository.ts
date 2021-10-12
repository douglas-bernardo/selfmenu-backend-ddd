import { v4 as uuid } from 'uuid';

import ICreateItemDTO from '@modules/item/dtos/ICreateItemDTO';
import Item from '@modules/item/infra/typeorm/entities/Item';
import IUpdateItemsQuantityDTO from '@modules/item/dtos/IUpdateItemsQuantityDTO';
import IFindByIdItemDTO from '@modules/item/dtos/IFindByIdItemDTO';
import IFindByNameItemDTO from '@modules/item/dtos/IFindByNameItemDTO';
import IFindAllItemsDTO from '@modules/item/dtos/IFindAllItemsDTO';
import IFindAllItemsByCategoryIdDTO from '@modules/item/dtos/IFindAllItemsByCategoryIdDTO';
import IItemRepository from '../IItemRepository';

interface IFindItems {
    id: string;
}

class FakeItemRepository implements IItemRepository {
    private items: Item[] = [];

    public async findAllByCategoryId({
        owner_id,
        category_id,
    }: IFindAllItemsByCategoryIdDTO): Promise<Item[]> {
        const itemsFiltered = this.items.filter(
            item =>
                item.owner_id === owner_id && item.category_id === category_id,
        );

        return itemsFiltered;
    }

    public async updateQuantity(
        items: IUpdateItemsQuantityDTO[],
    ): Promise<Item[]> {
        this.items.forEach((item, index) => {
            const findItem = items.find(f => f.id === item.id);

            if (findItem) {
                const newItem = {
                    ...item,
                    quantity: findItem.quantity,
                };
                this.items[index] = newItem;
            }
        });
        return this.items;
    }

    public async findAllById(items_ids: IFindItems[]): Promise<Item[]> {
        const itemsFiltered = this.items.filter(item => {
            return items_ids.some(f => {
                return f.id === item.id;
            });
        });
        return itemsFiltered;
    }

    public async findByName({
        name,
        owner_id,
    }: IFindByNameItemDTO): Promise<Item | undefined> {
        const findItem = this.items.find(
            item => item.name === name && item.owner_id === owner_id,
        );

        return findItem;
    }

    public async findAll({ owner_id }: IFindAllItemsDTO): Promise<Item[]> {
        let { items } = this;

        if (owner_id) {
            items = this.items.filter(item => item.owner_id === owner_id);
        }

        return items;
    }

    public async findById({
        id,
        owner_id,
    }: IFindByIdItemDTO): Promise<Item | undefined> {
        let findItem: Item | undefined;

        if (owner_id) {
            findItem = this.items.find(
                item => item.id === id && item.owner_id === owner_id,
            );
        } else {
            findItem = this.items.find(item => item.id === id);
        }

        return findItem;
    }

    public async create(data: ICreateItemDTO): Promise<Item> {
        const item = new Item();

        Object.assign(item, { id: uuid(), active: true }, data);

        this.items.push(item);
        return item;
    }

    public async save(item: Item): Promise<Item> {
        const findIndex = this.items.findIndex(
            findItem => findItem.id === item.id,
        );

        this.items[findIndex] = item;
        return item;
    }
}

export default FakeItemRepository;

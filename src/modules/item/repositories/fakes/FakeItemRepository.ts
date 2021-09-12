import { v4 as uuid } from 'uuid';

import ICreateItemDTO from '@modules/item/dtos/ICreateItemDTO';
import Item from '@modules/item/infra/typeorm/entities/Item';
import IUpdateItemsQuantityDTO from '@modules/item/dtos/IUpdateItemsQuantityDTO';
import IFindByIdItemDTO from '@modules/item/dtos/IFindByIdItemDTO';
import IItemRepository from '../IItemRepository';

interface IFindItems {
    id: string;
}

class FakeItemRepository implements IItemRepository {
    private items: Item[] = [];

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

    public async findByName(name: string): Promise<Item | undefined> {
        const findItem = this.items.find(item => item.name === name);

        return findItem;
    }

    public async findAll(): Promise<Item[]> {
        return this.items;
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

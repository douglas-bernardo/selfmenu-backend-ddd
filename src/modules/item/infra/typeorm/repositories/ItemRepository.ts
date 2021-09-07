import ICreateItemDTO from '@modules/item/dtos/ICreateItemDTO';
import IUpdateItemsQuantityDTO from '@modules/item/dtos/IUpdateItemsQuantityDTO';
import Item from '@modules/item/infra/typeorm/entities/Item';
import IItemRepository from '@modules/item/repositories/IItemRepository';
import { getRepository, In, Repository } from 'typeorm';

interface IFindItems {
    id: string;
}

class ItemRepository implements IItemRepository {
    private ormRepository: Repository<Item>;

    constructor() {
        this.ormRepository = getRepository(Item);
    }

    public async findAllById(
        items_ids: IFindItems[],
        owner_id: string,
    ): Promise<Item[]> {
        const itemsIds = items_ids.map(item => item.id);

        const existentItems = await this.ormRepository.find({
            where: {
                owner_id,
                id: In(itemsIds),
            },
        });

        return existentItems;
    }

    public async findAll(owner_id?: string): Promise<Item[]> {
        let items: Item[] = [];

        if (owner_id) {
            items = await this.ormRepository.find({
                where: {
                    owner_id,
                },
                relations: ['images'],
            });
        } else {
            items = await this.ormRepository.find();
        }

        return items;
    }

    public async findById(id: string): Promise<Item | undefined> {
        const item = await this.ormRepository.findOne(id);

        return item;
    }

    public async findByName(name: string): Promise<Item | undefined> {
        const item = await this.ormRepository.findOne({
            where: {
                name,
            },
        });

        return item;
    }

    public async create(data: ICreateItemDTO): Promise<Item> {
        const item = this.ormRepository.create(data);

        await this.ormRepository.save(item);

        return item;
    }

    public async save(item: Item): Promise<Item> {
        return this.ormRepository.save(item);
    }

    public async updateQuantity(
        items: IUpdateItemsQuantityDTO[],
    ): Promise<Item[]> {
        return this.ormRepository.save(items);
    }
}

export default ItemRepository;

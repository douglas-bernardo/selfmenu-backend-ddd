import ICreateItemDTO from '@modules/item/dtos/ICreateItemDTO';
import IFindByIdItemDTO from '@modules/item/dtos/IFindByIdItemDTO';
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
            items = await this.ormRepository.find({ relations: ['images'] });
        }

        return items;
    }

    public async findById({
        id,
        owner_id,
    }: IFindByIdItemDTO): Promise<Item | undefined> {
        let findItem: Item | undefined;

        if (owner_id) {
            findItem = await this.ormRepository.findOne({
                where: {
                    id,
                    owner_id,
                },
                relations: ['images'],
            });
        } else {
            findItem = await this.ormRepository.findOne({
                where: {
                    id,
                },
                relations: ['images'],
            });
        }

        return findItem;
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

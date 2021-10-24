import ICreateItemDTO from '@modules/item/dtos/ICreateItemDTO';
import IFindAllItemsByCategoryIdDTO from '@modules/item/dtos/IFindAllItemsByCategoryIdDTO';
import IFindAllItemsDTO from '@modules/item/dtos/IFindAllItemsDTO';
import IFindByIdItemDTO from '@modules/item/dtos/IFindByIdItemDTO';
import IFindByNameItemDTO from '@modules/item/dtos/IFindByNameItemDTO';
import IUpdateItemsQuantityDTO from '@modules/item/dtos/IUpdateItemsQuantityDTO';
import Item from '@modules/item/infra/typeorm/entities/Item';
import IItemRepository from '@modules/item/repositories/IItemRepository';
import { getRepository, In, Repository, Like } from 'typeorm';

interface IFindItems {
    id: string;
}

class ItemRepository implements IItemRepository {
    private ormRepository: Repository<Item>;

    constructor() {
        this.ormRepository = getRepository(Item);
    }

    public async findAllByCategoryId({
        owner_id,
        category_id,
    }: IFindAllItemsByCategoryIdDTO): Promise<Item[]> {
        const items = await this.ormRepository.find({
            where: {
                owner_id,
                category_id,
            },
            relations: ['images'],
        });

        return items;
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

    public async findAll({ owner_id }: IFindAllItemsDTO): Promise<Item[]> {
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

    public async findByName({
        name,
        owner_id,
    }: IFindByNameItemDTO): Promise<Item | undefined> {
        const item = await this.ormRepository.findOne({
            where: {
                name,
                owner_id,
            },
        });

        return item;
    }

    public async findAllByName({
        name,
        owner_id,
        category_id,
    }: IFindByNameItemDTO): Promise<Item[]> {
        let items: Item[] = [];

        if (category_id) {
            items = await this.ormRepository.find({
                where: {
                    name: Like(`${name}%`),
                    owner_id,
                    category_id,
                },
                relations: ['images', 'category'],
            });
        } else {
            items = await this.ormRepository.find({
                where: {
                    name: Like(`${name}%`),
                    owner_id,
                },
                relations: ['images', 'category'],
            });
        }

        return items;
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

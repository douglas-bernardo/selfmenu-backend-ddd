import { injectable, inject } from 'tsyringe';

// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IItemRepository from '../repositories/IItemRepository';
import Item from '../infra/typeorm/entities/Item';

interface IRequest {
    owner_id: string;
    category_id: number;
}

@injectable()
class ListItemsService {
    constructor(
        @inject('ItemRepository')
        private itemRepository: IItemRepository, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ owner_id, category_id }: IRequest): Promise<Item[]> {
        // await this.cacheProvider.invalidatePrefix('items-list');
        // let items = await this.cacheProvider.recover<Item[]>(
        //     `items-list:${owner_id}-${category_id}`,
        // );

        // if (!items) {
        //     if (category_id !== 0) {
        //         items = await this.itemRepository.findAllByCategoryId({
        //             owner_id,
        //             category_id,
        //         });
        //     } else {
        //         items = await this.itemRepository.findAll({ owner_id });
        //     }

        //     await this.cacheProvider.save(`items-list:${owner_id}`, items);
        // }

        let items: Item[] = [];
        if (category_id !== 0) {
            items = await this.itemRepository.findAllByCategoryId({
                owner_id,
                category_id,
            });
        } else {
            items = await this.itemRepository.findAll({ owner_id });
        }

        return items;
    }
}

export default ListItemsService;

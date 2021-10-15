import { injectable, inject } from 'tsyringe';

import IItemRepository from '../repositories/IItemRepository';
import Item from '../infra/typeorm/entities/Item';

interface IRequest {
    owner_id: string;
    param: string;
}

@injectable()
class SearchItemsService {
    constructor(
        @inject('ItemRepository') private itemRepository: IItemRepository,
    ) {}

    public async execute({ owner_id, param }: IRequest): Promise<Item[]> {
        const items = await this.itemRepository.findAllByName({
            owner_id,
            name: param.trim(),
        });

        return items;
    }
}

export default SearchItemsService;

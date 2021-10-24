import { injectable, inject } from 'tsyringe';

import IItemRepository from '../repositories/IItemRepository';
import Item from '../infra/typeorm/entities/Item';

interface IRequest {
    owner_id: string;
    name: string;
    category_id?: number;
}

@injectable()
class SearchItemsService {
    constructor(
        @inject('ItemRepository') private itemRepository: IItemRepository,
    ) {}

    public async execute({
        owner_id,
        name,
        category_id,
    }: IRequest): Promise<Item[]> {
        const items = await this.itemRepository.findAllByName({
            owner_id,
            name: name.trim(),
            category_id,
        });

        return items;
    }
}

export default SearchItemsService;

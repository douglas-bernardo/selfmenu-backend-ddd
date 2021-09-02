import { injectable, inject } from 'tsyringe';

import IItemRepository from '../repositories/IItemRepository';
import Item from '../infra/typeorm/entities/Item';

interface IRequest {
    user_id?: string;
}

@injectable()
class ListItemsService {
    constructor(
        @inject('ItemRepository') private itemRepository: IItemRepository,
    ) {}

    public async execute({ user_id }: IRequest): Promise<Item[]> {
        return this.itemRepository.findAll(user_id);
    }
}

export default ListItemsService;

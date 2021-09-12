import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IItemRepository from '../repositories/IItemRepository';
import Item from '../infra/typeorm/entities/Item';

interface IRequest {
    item_id: string;
    owner_id: string;
}

@injectable()
class ShowItemService {
    constructor(
        @inject('ItemRepository') private itemRepository: IItemRepository,
    ) {}

    public async execute({ item_id, owner_id }: IRequest): Promise<Item> {
        const item = await this.itemRepository.findById({
            id: item_id,
            owner_id,
        });

        if (!item) {
            throw new AppError('Item not found');
        }

        return item;
    }
}

export default ShowItemService;

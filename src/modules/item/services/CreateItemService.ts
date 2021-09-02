import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IItemRepository from '../repositories/IItemRepository';
import Item from '../infra/typeorm/entities/Item';

interface IRequest {
    user_id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category_id: number;
    images?: Express.Multer.File[];
}

@injectable()
class CreateItemService {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository,
        @inject('ItemRepository') private itemRepository: IItemRepository,
        @inject('StorageProvider') private storageProvider: IStorageProvider,
    ) {}

    public async execute({
        user_id,
        name,
        description,
        price,
        quantity,
        category_id,
        images,
    }: IRequest): Promise<Item> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        if (!user.active) {
            throw new AppError('User inactive. Not allowed to create item');
        }

        const namePrepared = name.trim();
        const checkIfItemExists = await this.itemRepository.findByName(
            namePrepared,
        );

        if (checkIfItemExists) {
            throw new AppError('Item already exists');
        }

        if (images) {
            const toDelete = images.map(image => {
                return { url: image.filename };
            });
            await this.storageProvider.deleteFiles(toDelete);
            await this.storageProvider.saveFiles(toDelete);
        }

        const item = this.itemRepository.create({
            name,
            description,
            price,
            quantity,
            category_id,
            owner_id: user_id,
            images:
                images &&
                images.map(image => {
                    return { url: image.filename };
                }),
        });

        return item;
    }
}

export default CreateItemService;

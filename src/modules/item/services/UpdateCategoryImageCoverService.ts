import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICategoryRepository from '../repositories/ICategoryRepository';
import Category from '../infra/typeorm/entities/Category';

interface IRequest {
    owner_id: string;
    category_id: string;
    imageCoverFilename: string;
}

@injectable()
class UpdateCategoryImageCoverService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CategoryRepository')
        private categoryRepository: ICategoryRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({
        owner_id,
        category_id,
        imageCoverFilename,
    }: IRequest): Promise<Category> {
        const user = await this.usersRepository.findById(owner_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change category cover',
                401,
            );
        }

        const category = await this.categoryRepository.findById({
            id: category_id,
            owner_id,
        });

        if (!category) {
            throw new AppError('Category not found');
        }

        if (category.image_cover) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(
            imageCoverFilename,
        );

        category.image_cover = filename;

        await this.categoryRepository.save(category);

        return category;
    }
}

export default UpdateCategoryImageCoverService;

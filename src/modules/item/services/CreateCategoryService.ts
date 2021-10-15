import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Category from '../infra/typeorm/entities/Category';
import ICategoryRepository from '../repositories/ICategoryRepository';

interface IRequest {
    name: string;
    owner_id: string;
    image_cover?: string;
}

@injectable()
class CreateCategoryService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CategoryRepository')
        private categoryRepository: ICategoryRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({
        name,
        owner_id,
        image_cover,
    }: IRequest): Promise<Category> {
        const user = await this.usersRepository.findById(owner_id);

        if (!user) {
            throw new AppError('User account not found');
        }

        if (!user.active) {
            throw new AppError(
                'Only active accounts can create a new category',
            );
        }

        const categoryExists = await this.categoryRepository.findByName({
            name,
            owner_id,
        });

        if (categoryExists) {
            throw new AppError('Category already exists.');
        }

        let filename: string | undefined;
        if (image_cover) {
            filename = await this.storageProvider.saveFile(image_cover);
        }

        const category = await this.categoryRepository.create({
            name,
            owner: user,
            image_cover: filename,
        });

        return category;
    }
}

export default CreateCategoryService;

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
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
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

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
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError(
                'Only authenticated accounts can change category cover',
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
            await this.storageProvider.deleteFile(account.avatar);
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

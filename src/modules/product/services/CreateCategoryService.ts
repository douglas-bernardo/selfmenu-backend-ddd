import { injectable, inject } from 'tsyringe';

import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
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
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

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
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Account account not found');
        }

        if (!account.active) {
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
            owner: account,
            image_cover: filename,
        });

        return category;
    }
}

export default CreateCategoryService;

import { injectable, inject } from 'tsyringe';

import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Category from '../infra/typeorm/entities/Category';
import ICategoryRepository from '../repositories/ICategoryRepository';

interface IRequest {
    owner_id: string;
    category_id: number;
    name: string;
    active?: boolean;
    image_cover?: string;
}

@injectable()
class UpdateCategoryService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('CategoryRepository')
        private categoryRepository: ICategoryRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({
        category_id,
        name,
        owner_id,
        active,
        image_cover,
    }: IRequest): Promise<Category> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Conta não encontrada');
        }

        if (!account.active) {
            throw new AppError(
                'Somente contas ativas podem criar uma categoria',
            );
        }

        const categoryToEdit = await this.categoryRepository.findById({
            id: category_id,
        });

        if (!categoryToEdit) {
            throw new AppError('Categoria não encontrada.');
        }

        const existCurrentCategory = await this.categoryRepository.findByName({
            name,
            owner_id: account.id,
        });

        if (
            existCurrentCategory &&
            existCurrentCategory.id !== categoryToEdit.id
        ) {
            throw new AppError('Já existe uma categoria com esse nome');
        }

        let filename: string | undefined;
        if (image_cover) {
            if (categoryToEdit.image_cover) {
                await this.storageProvider.deleteFile(
                    categoryToEdit.image_cover,
                );
            }

            filename = await this.storageProvider.saveFile(image_cover);
        }

        const categoryEdited = Object.assign(categoryToEdit, {
            name,
            image_cover: filename,
            active,
        });

        return this.categoryRepository.save(categoryEdited);
    }
}

export default UpdateCategoryService;

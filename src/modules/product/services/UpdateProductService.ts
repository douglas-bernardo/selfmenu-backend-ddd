import { injectable, inject } from 'tsyringe';

import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
    owner_id: string;
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    category_id: number;
    description?: string;
    available?: number;
    photo?: string;
}

@injectable()
class UpdateProductService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('ProductRepository')
        private productRepository: IProductRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        owner_id,
        product_id,
        name,
        description,
        price,
        quantity,
        category_id,
        available,
        photo,
    }: IRequest): Promise<Product> {
        const account = await this.accountsRepository.findById(owner_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        if (!account.active) {
            throw new AppError(
                'Account inactive. Not allowed to create product',
            );
        }

        const productToEdit = await this.productRepository.findById({
            id: product_id,
        });

        if (!productToEdit) {
            throw new AppError('Produto não encontrado.');
        }

        const namePrepared = name.trim();
        const checkIfProductExists = await this.productRepository.findByName({
            name: namePrepared,
            owner_id: account.id,
        });

        if (
            checkIfProductExists &&
            checkIfProductExists.id !== productToEdit.id
        ) {
            throw new AppError('Já existe um produto com esse nome');
        }

        let filename: string | undefined;
        if (photo) {
            if (productToEdit.photo) {
                await this.storageProvider.deleteFile(productToEdit.photo);
            }

            filename = await this.storageProvider.saveFile(photo);
        }

        const productEdited = Object.assign(productToEdit, {
            name,
            description,
            price,
            quantity,
            category_id,
            photo: filename,
            available,
        });

        await this.cacheProvider.invalidatePrefix('products-list');

        return this.productRepository.save(productEdited);
    }
}

export default UpdateProductService;

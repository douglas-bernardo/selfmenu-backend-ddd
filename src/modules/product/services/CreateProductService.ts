import { injectable, inject } from 'tsyringe';

import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
    account_id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category_id: number;
    photo?: string;
}

@injectable()
class CreateProductService {
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
        account_id,
        name,
        description,
        price,
        quantity,
        category_id,
        photo,
    }: IRequest): Promise<Product> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        if (!account.active) {
            throw new AppError(
                'Account inactive. Not allowed to create product',
            );
        }

        const namePrepared = name.trim();
        const checkIfProductExists = await this.productRepository.findByName({
            name: namePrepared,
            owner_id: account.id,
        });

        if (checkIfProductExists) {
            throw new AppError('Product already exists');
        }

        let filename: string | undefined;
        if (photo) {
            filename = await this.storageProvider.saveFile(photo);
        }

        const product = await this.productRepository.create({
            name,
            description,
            price,
            quantity,
            category_id,
            owner_id: account_id,
            photo: filename,
        });

        await this.cacheProvider.invalidatePrefix('products-list');

        return product;
    }
}

export default CreateProductService;

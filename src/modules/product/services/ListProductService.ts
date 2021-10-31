import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
    owner_id: string;
    category_id: number;
}

@injectable()
class ListProductsService {
    constructor(
        @inject('ProductRepository')
        private productRepository: IProductRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        owner_id,
        category_id,
    }: IRequest): Promise<Product[]> {
        await this.cacheProvider.invalidatePrefix('products-list');
        let products = await this.cacheProvider.recover<Product[]>(
            `products-list:${owner_id}-${category_id}`,
        );

        if (!products) {
            if (category_id !== 0) {
                products = await this.productRepository.findAllByCategoryId({
                    owner_id,
                    category_id,
                });
            } else {
                products = await this.productRepository.findAll({ owner_id });
            }

            await this.cacheProvider.save(
                `products-list:${owner_id}`,
                products,
            );
        }

        return products;
    }
}

export default ListProductsService;

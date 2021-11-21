import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
    owner_id: string;
    category_id?: number;
    offset?: number;
    limit?: number;
}

interface IResponse {
    products: Product[];
    total: number;
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
        offset,
        limit,
    }: IRequest): Promise<IResponse> {
        await this.cacheProvider.invalidatePrefix('products-list');

        let count = 0;
        let products = await this.cacheProvider.recover<Product[]>(
            `products-list:${owner_id}-${category_id}`,
        );

        if (!products) {
            if (category_id && category_id !== 0) {
                count = await this.productRepository.count({
                    owner_id,
                    category_id,
                });

                products = await this.productRepository.findAllByCategoryId({
                    owner_id,
                    category_id,
                    offset,
                    limit,
                });
            } else {
                count = await this.productRepository.count({
                    owner_id,
                });

                products = await this.productRepository.findAll({
                    owner_id,
                    offset,
                    limit,
                });
            }

            await this.cacheProvider.save(
                `products-list:${owner_id}`,
                products,
            );
        }

        return { products, total: count };
    }
}

export default ListProductsService;

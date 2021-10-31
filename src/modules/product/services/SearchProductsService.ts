import { injectable, inject } from 'tsyringe';

import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
    owner_id: string;
    name: string;
    category_id?: number;
}

@injectable()
class SearchProductsService {
    constructor(
        @inject('ProductRepository')
        private productRepository: IProductRepository,
    ) {}

    public async execute({
        owner_id,
        name,
        category_id,
    }: IRequest): Promise<Product[]> {
        const products = await this.productRepository.findAllByName({
            owner_id,
            name: name.trim(),
            category_id,
        });

        return products;
    }
}

export default SearchProductsService;

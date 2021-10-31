import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IProductRepository from '../repositories/IProductRepository';
import Product from '../infra/typeorm/entities/Product';

interface IRequest {
    product_id: string;
    owner_id: string;
}

@injectable()
class ShowProductService {
    constructor(
        @inject('ProductRepository')
        private productRepository: IProductRepository,
    ) {}

    public async execute({ product_id, owner_id }: IRequest): Promise<Product> {
        const product = await this.productRepository.findById({
            id: product_id,
            owner_id,
        });

        if (!product) {
            throw new AppError('Product not found');
        }

        return product;
    }
}

export default ShowProductService;

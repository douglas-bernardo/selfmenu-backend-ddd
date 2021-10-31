import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICategoryRepository from '../repositories/ICategoryRepository';
import Category from '../infra/typeorm/entities/Category';

interface IRequest {
    id: string;
    owner_id: string;
}

@injectable()
class ShowCategoryService {
    constructor(
        @inject('CategoryRepository')
        private categoryRepository: ICategoryRepository,
    ) {}

    public async execute({ id, owner_id }: IRequest): Promise<Category> {
        const category = await this.categoryRepository.findById({
            id,
            owner_id,
        });

        if (!category) {
            throw new AppError('Category not found');
        }

        return category;
    }
}

export default ShowCategoryService;

import { injectable, inject } from 'tsyringe';
import Category from '../infra/typeorm/entities/Category';

import ICategoryRepository from '../repositories/ICategoryRepository';

interface IRequest {
    owner_id: string;
}

@injectable()
class ListCategoriesService {
    constructor(
        @inject('CategoryRepository')
        private categoryRepository: ICategoryRepository,
    ) {}

    public async execute({ owner_id }: IRequest): Promise<Category[]> {
        return this.categoryRepository.findAll({ owner_id });
    }
}

export default ListCategoriesService;

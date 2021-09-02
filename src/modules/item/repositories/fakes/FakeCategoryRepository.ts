import { v4 as uuid } from 'uuid';

import Category from '@modules/item/infra/typeorm/entities/Category';
import ICategoryRepository from '../ICategoryRepository';

class FakeCategoryRepository implements ICategoryRepository {
    private categories: Category[] = [];

    public async findAll(): Promise<Category[]> {
        return this.categories;
    }

    public async create(name: string, owner_id: string): Promise<Category> {
        const category = new Category();

        Object.assign(category, { id: uuid(), name, owner_id });

        this.categories.push(category);
        return category;
    }

    public async save(category: Category): Promise<Category> {
        const findIndex = this.categories.findIndex(
            findCategory => findCategory.id === category.id,
        );

        this.categories[findIndex] = category;
        return category;
    }
}

export default FakeCategoryRepository;

import { v4 as uuid } from 'uuid';

import Category from '@modules/item/infra/typeorm/entities/Category';
import ICreateCategoryDTO from '@modules/item/dtos/ICreateCategoryDTO';
import IFindAllCategoriesDTO from '@modules/item/dtos/IFindAllCategoriesDTO';
import IFindByNameCategoryDTO from '@modules/item/dtos/IFindByNameCategoryDTO';
import IFindByIdCategoryDTO from '@modules/item/dtos/IFindByIdCategoryDTO';
import ICategoryRepository from '../ICategoryRepository';

class FakeCategoryRepository implements ICategoryRepository {
    private categories: Category[] = [];

    public async findById({
        id,
        owner_id,
    }: IFindByIdCategoryDTO): Promise<Category | undefined> {
        const findCategory = this.categories.find(
            category =>
                category.id === Number(id) && category.owner.id === owner_id,
        );

        return findCategory;
    }

    public async findByName({
        name,
        owner_id,
    }: IFindByNameCategoryDTO): Promise<Category | undefined> {
        const findCategory = this.categories.find(
            category =>
                category.name === name && category.owner.id === owner_id,
        );

        return findCategory;
    }

    public async findAll({
        owner_id,
    }: IFindAllCategoriesDTO): Promise<Category[]> {
        const findCategories = this.categories.filter(
            category => category.owner.id === owner_id,
        );

        return findCategories;
    }

    public async create({
        name,
        owner,
    }: ICreateCategoryDTO): Promise<Category> {
        const category = new Category();

        Object.assign(category, { id: uuid(), name, owner });

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

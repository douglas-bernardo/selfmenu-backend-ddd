import { getRepository, Repository } from 'typeorm';

import Category from '@modules/item/infra/typeorm/entities/Category';
import ICreateCategoryDTO from '@modules/item/dtos/ICreateCategoryDTO';
import IFindAllCategoriesDTO from '@modules/item/dtos/IFindAllCategoriesDTO';
import IFindByNameCategoryDTO from '@modules/item/dtos/IFindByNameCategoryDTO';
import ICategoryRepository from '@modules/item/repositories/ICategoryRepository';
import IFindByIdCategoryDTO from '@modules/item/dtos/IFindByIdCategoryDTO';

class CategoryRepository implements ICategoryRepository {
    private ormRepository: Repository<Category>;

    constructor() {
        this.ormRepository = getRepository(Category);
    }

    public async findById({
        id,
        owner_id,
    }: IFindByIdCategoryDTO): Promise<Category | undefined> {
        const findCategory = await this.ormRepository.findOne({
            where: {
                id,
                owner_id,
            },
        });

        return findCategory;
    }

    public async findByName({
        name,
        owner_id,
    }: IFindByNameCategoryDTO): Promise<Category | undefined> {
        const findCategory = await this.ormRepository.findOne({
            where: {
                name,
                owner_id,
            },
        });

        return findCategory;
    }

    public async findAll({
        owner_id,
    }: IFindAllCategoriesDTO): Promise<Category[]> {
        const categories = await this.ormRepository.find({
            where: {
                owner_id,
            },
        });

        return categories;
    }

    public async create({
        name,
        owner,
    }: ICreateCategoryDTO): Promise<Category> {
        const category = this.ormRepository.create({
            name,
            owner,
        });

        await this.ormRepository.save(category);

        return category;
    }

    public async save(category: Category): Promise<Category> {
        return this.ormRepository.save(category);
    }
}

export default CategoryRepository;

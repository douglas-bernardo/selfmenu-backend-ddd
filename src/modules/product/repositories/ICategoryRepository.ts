import ICreateCategoryDTO from '../dtos/ICreateCategoryDTO';
import IFindAllCategoriesDTO from '../dtos/IFindAllCategoriesDTO';
import IFindByIdCategoryDTO from '../dtos/IFindByIdCategoryDTO';
import IFindByNameCategoryDTO from '../dtos/IFindByNameCategoryDTO';
import Category from '../infra/typeorm/entities/Category';

export default interface ICategoryRepository {
    findAll(data: IFindAllCategoriesDTO): Promise<Category[]>;
    findById(data: IFindByIdCategoryDTO): Promise<Category | undefined>;
    findByName(data: IFindByNameCategoryDTO): Promise<Category | undefined>;
    create(data: ICreateCategoryDTO): Promise<Category>;
    save(category: Category): Promise<Category>;
}

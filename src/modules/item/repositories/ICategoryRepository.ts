import Category from '../infra/typeorm/entities/Category';

export default interface ICategoryRepository {
    findAll(): Promise<Category[]>;
    create(name: string, owner_id: string): Promise<Category>;
    save(category: Category): Promise<Category>;
}

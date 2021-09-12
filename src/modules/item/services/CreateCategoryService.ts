import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Category from '../infra/typeorm/entities/Category';
import ICategoryRepository from '../repositories/ICategoryRepository';

interface IRequest {
    name: string;
    owner_id: string;
}

@injectable()
class CreateCategoryService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CategoryRepository')
        private categoryRepository: ICategoryRepository,
    ) {}

    public async execute({ name, owner_id }: IRequest): Promise<Category> {
        const user = await this.usersRepository.findById(owner_id);

        if (!user) {
            throw new AppError('User account not found');
        }

        if (!user.active) {
            throw new AppError(
                'Only active accounts can create a new category',
            );
        }

        const categoryExists = await this.categoryRepository.findByName({
            name,
            owner_id,
        });

        if (categoryExists) {
            throw new AppError('Category already exists.');
        }

        const category = await this.categoryRepository.create({
            name,
            owner: user,
        });

        return category;
    }
}

export default CreateCategoryService;

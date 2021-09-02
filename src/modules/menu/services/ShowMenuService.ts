import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/entities/Menu';

interface IRequest {
    id: string;
}

@injectable()
class ShowMenuService {
    constructor(
        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute({ id }: IRequest): Promise<Menu> {
        const menu = await this.menuRepository.findById(id);

        if (!menu) {
            throw new AppError('Menu not found');
        }

        return menu;
    }
}

export default ShowMenuService;

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { getRepository, In } from 'typeorm';
import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/entities/Menu';
import MenuProduct from '../infra/typeorm/entities/MenuProduct';

interface IRequestProduct {
    id: string;
}

interface IRequest {
    account_id: string;
    menu_id: string;
    products: IRequestProduct[];
}

@injectable()
class RemoveProductsMenuService {
    constructor(
        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute({
        account_id,
        menu_id,
        products,
    }: IRequest): Promise<Menu> {
        const menu = await this.menuRepository.findById(menu_id, account_id);

        if (!menu) {
            throw new AppError('Menu not found');
        }

        menu.menu_products = menu.menu_products.filter(product => {
            return products.some(i => {
                return i.id !== product.product_id;
            });
        });

        const productIds = products.map(product => product.id);
        const menuProductsRepository = getRepository(MenuProduct);
        const productsToDelete = await menuProductsRepository.find({
            where: {
                menu_id,
                product_id: In(productIds),
            },
        });
        await menuProductsRepository.remove(productsToDelete);

        return menu;
    }
}

export default RemoveProductsMenuService;

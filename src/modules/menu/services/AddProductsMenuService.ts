import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IProductRepository from '@modules/product/repositories/IProductRepository';
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
class AddProductsMenuService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('ProductRepository')
        private productRepository: IProductRepository,

        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute({
        account_id,
        menu_id,
        products,
    }: IRequest): Promise<Menu> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account not found');
        }

        const menu = await this.menuRepository.findById(menu_id, account_id);

        if (!menu) {
            throw new AppError('Menu not found');
        }

        const existentProducts = await this.productRepository.findAllById(
            products,
            account_id,
        );

        if (!existentProducts.length) {
            throw new AppError('Cannot find any products with the given ids');
        }

        const existentProductsIds = existentProducts.map(product => product.id);

        const checkInexistentProducts = products.filter(
            product => !existentProductsIds.includes(product.id),
        );

        if (checkInexistentProducts.length) {
            throw new AppError(
                `Could not find product ${checkInexistentProducts[0].id}`,
            );
        }

        const nonDuplicates = products.filter(
            (elem, index, self) =>
                self.findIndex(t => {
                    return t.id === elem.id;
                }) === index,
        );

        const productsNotIncludedInMenu = nonDuplicates.filter(product => {
            return menu.menu_products.every(i => i.product_id !== product.id);
        });

        productsNotIncludedInMenu.forEach(product => {
            menu.menu_products.push({
                product_id: product.id,
                menu_id,
                active: true,
            } as MenuProduct);
        });

        await this.menuRepository.save(menu);

        return menu;
    }
}

export default AddProductsMenuService;

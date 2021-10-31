import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IEstablishmentRepository from '@modules/establishment/repositories/IEstablishmentRepository';
import IAccountsRepository from '@modules/account/repositories/IAccountRepository';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import IMenuRepository from '../repositories/IMenuRepository';
import Menu from '../infra/typeorm/entities/Menu';

interface IProduct {
    product_id: string;
}

interface IRequestProduct {
    id: string;
}

interface IRequest {
    account_id: string;
    title: string;
    description?: string;
    establishment_id: string;
    products: IRequestProduct[];
}

@injectable()
class CreateMenuService {
    constructor(
        @inject('AccountsRepository')
        private accountsRepository: IAccountsRepository,

        @inject('ProductRepository')
        private productRepository: IProductRepository,

        @inject('EstablishmentRepository')
        private establishmentRepository: IEstablishmentRepository,

        @inject('MenuRepository')
        private menuRepository: IMenuRepository,
    ) {}

    public async execute({
        account_id,
        title,
        description,
        establishment_id,
        products,
    }: IRequest): Promise<Menu> {
        const account = await this.accountsRepository.findById(account_id);

        if (!account) {
            throw new AppError('Account account not found');
        }

        if (account.plan.name === 'Free') {
            const hasMenuCreated = await this.menuRepository.findAll({
                owner_id: account.id,
            });

            if (hasMenuCreated.length > 0) {
                throw new AppError(
                    'Only Premium accounts can register more than one menu by account.',
                );
            }
        }

        const establishment = await this.establishmentRepository.findById({
            establishment_id,
            owner_id: account_id,
        });

        if (!establishment) {
            throw new AppError('Establishment not found');
        }

        if (!establishment.active) {
            throw new AppError('Establishment inactive. Not allowed.');
        }

        const menuTitleExists = await this.menuRepository.findByTitle(title);

        if (menuTitleExists) {
            throw new AppError('Menu title already used');
        }

        let serializeProducts = {} as IProduct[];
        if (products) {
            const existentProducts = await this.productRepository.findAllById(
                products,
                account_id,
            );

            if (!existentProducts.length) {
                throw new AppError(
                    'Cannot find any products with the given ids',
                );
            }

            const existentProductsIds = existentProducts.map(
                product => product.id,
            );

            const checkInexistentProducts = products.filter(
                product => !existentProductsIds.includes(product.id),
            );

            if (checkInexistentProducts.length) {
                throw new AppError(
                    `Could not find product ${checkInexistentProducts[0].id}`,
                );
            }

            serializeProducts = products.map(product => ({
                product_id: product.id,
            }));
        }

        const menu = await this.menuRepository.create({
            title,
            description,
            owner: account,
            establishment,
            products: serializeProducts,
        });

        return menu;
    }
}

export default CreateMenuService;

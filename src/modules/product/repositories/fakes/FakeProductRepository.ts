import { v4 as uuid } from 'uuid';

import ICreateProductDTO from '@modules/product/dtos/ICreateProductDTO';
import Product from '@modules/product/infra/typeorm/entities/Product';
import IUpdateProductQuantityDTO from '@modules/product/dtos/IUpdateProductQuantityDTO';
import IFindByIdProductDTO from '@modules/product/dtos/IFindByIdProductDTO';
import IFindByNameProductDTO from '@modules/product/dtos/IFindByNameProductDTO';
import IFindAllProductsDTO from '@modules/product/dtos/IFindAllProductsDTO';
import IFindAllProductsByCategoryIdDTO from '@modules/product/dtos/IFindAllProductsByCategoryIdDTO';
import IProductRepository from '../IProductRepository';

interface IFindProducts {
    id: string;
}

class FakeProductRepository implements IProductRepository {
    private products: Product[] = [];

    public async findAllByName(): Promise<Product[]> {
        throw new Error('Method not implemented.');
    }

    public async findAllByCategoryId({
        owner_id,
        category_id,
    }: IFindAllProductsByCategoryIdDTO): Promise<Product[]> {
        const productsFiltered = this.products.filter(
            product =>
                product.owner_id === owner_id &&
                product.category_id === category_id,
        );

        return productsFiltered;
    }

    public async updateQuantity(
        products: IUpdateProductQuantityDTO[],
    ): Promise<Product[]> {
        this.products.forEach((product, index) => {
            const findProduct = products.find(f => f.id === product.id);

            if (findProduct) {
                const editProduct = new Product();
                Object.assign(editProduct, {
                    ...product,
                    quantity: findProduct.quantity,
                });

                // const newProduct = {
                //     ...product,
                //     quantity: findProduct.quantity,
                // };
                this.products[index] = editProduct;
            }
        });
        return this.products;
    }

    public async findAllById(
        products_ids: IFindProducts[],
    ): Promise<Product[]> {
        const productsFiltered = this.products.filter(product => {
            return products_ids.some(f => {
                return f.id === product.id;
            });
        });
        return productsFiltered;
    }

    public async findByName({
        name,
        owner_id,
    }: IFindByNameProductDTO): Promise<Product | undefined> {
        const findProduct = this.products.find(
            product => product.name === name && product.owner_id === owner_id,
        );

        return findProduct;
    }

    public async findAll({
        owner_id,
    }: IFindAllProductsDTO): Promise<Product[]> {
        let { products } = this;

        if (owner_id) {
            products = this.products.filter(
                product => product.owner_id === owner_id,
            );
        }

        return products;
    }

    public async findById({
        id,
        owner_id,
    }: IFindByIdProductDTO): Promise<Product | undefined> {
        let findProduct: Product | undefined;

        if (owner_id) {
            findProduct = this.products.find(
                product => product.id === id && product.owner_id === owner_id,
            );
        } else {
            findProduct = this.products.find(product => product.id === id);
        }

        return findProduct;
    }

    public async create(data: ICreateProductDTO): Promise<Product> {
        const product = new Product();

        Object.assign(product, { id: uuid(), active: true }, data);

        this.products.push(product);
        return product;
    }

    public async save(product: Product): Promise<Product> {
        const findIndex = this.products.findIndex(
            findProduct => findProduct.id === product.id,
        );

        this.products[findIndex] = product;
        return product;
    }
}

export default FakeProductRepository;

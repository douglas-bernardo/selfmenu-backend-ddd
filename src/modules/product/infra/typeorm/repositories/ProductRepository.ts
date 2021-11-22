import ICreateProductDTO from '@modules/product/dtos/ICreateProductDTO';
import IFindAllProductsByCategoryIdDTO from '@modules/product/dtos/IFindAllProductsByCategoryIdDTO';
import IFindAllProductsDTO from '@modules/product/dtos/IFindAllProductsDTO';
import IFindByIdProductDTO from '@modules/product/dtos/IFindByIdProductDTO';
import IFindByNameProductDTO from '@modules/product/dtos/IFindByNameProductDTO';
import IUpdateProductQuantityDTO from '@modules/product/dtos/IUpdateProductQuantityDTO';
import Product from '@modules/product/infra/typeorm/entities/Product';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { getRepository, In, Repository, Like } from 'typeorm';

interface IFindProducts {
    id: string;
}

interface ICountRecords {
    [key: string]: any;
}

class ProductRepository implements IProductRepository {
    private ormRepository: Repository<Product>;

    constructor() {
        this.ormRepository = getRepository(Product);
    }

    public async count(data: ICountRecords): Promise<number> {
        return this.ormRepository.count({
            where: data,
        });
    }

    public async findAllByCategoryId({
        owner_id,
        category_id,
        offset,
        limit,
    }: IFindAllProductsByCategoryIdDTO): Promise<Product[]> {
        const products = await this.ormRepository.find({
            where: {
                owner_id,
                category_id,
            },
            skip: offset || 0, // offset
            take: limit || 10, // limit
            order: {
                name: 'ASC',
            },
        });

        return products;
    }

    public async findAllById(
        products_ids: IFindProducts[],
        owner_id: string,
    ): Promise<Product[]> {
        const productsIds = products_ids.map(product => product.id);

        const existentProducts = await this.ormRepository.find({
            where: {
                owner_id,
                id: In(productsIds),
            },
        });

        return existentProducts;
    }

    public async findAll({
        owner_id,
        offset,
        limit,
    }: IFindAllProductsDTO): Promise<Product[]> {
        let products: Product[] = [];

        if (owner_id) {
            products = await this.ormRepository.find({
                where: {
                    owner_id,
                },
                skip: offset || 0, // offset
                take: limit || 10, // limit
                order: {
                    name: 'ASC',
                },
                relations: ['category'],
            });
        } else {
            products = await this.ormRepository.find();
        }

        return products;
    }

    public async findById({
        id,
        owner_id,
    }: IFindByIdProductDTO): Promise<Product | undefined> {
        let findProduct: Product | undefined;

        if (owner_id) {
            findProduct = await this.ormRepository.findOne({
                where: {
                    id,
                    owner_id,
                },
            });
        } else {
            findProduct = await this.ormRepository.findOne({
                where: {
                    id,
                },
            });
        }

        return findProduct;
    }

    public async findByName({
        name,
        owner_id,
    }: IFindByNameProductDTO): Promise<Product | undefined> {
        const product = await this.ormRepository.findOne({
            where: {
                name,
                owner_id,
            },
        });

        return product;
    }

    public async findAllByName({
        name,
        owner_id,
        category_id,
    }: IFindByNameProductDTO): Promise<Product[]> {
        let products: Product[] = [];

        if (category_id) {
            products = await this.ormRepository.find({
                where: {
                    name: Like(`${name}%`),
                    owner_id,
                    category_id,
                },
                relations: ['category'],
            });
        } else {
            products = await this.ormRepository.find({
                where: {
                    name: Like(`${name}%`),
                    owner_id,
                },
                relations: ['category'],
            });
        }

        return products;
    }

    public async create(data: ICreateProductDTO): Promise<Product> {
        const product = this.ormRepository.create(data);

        await this.ormRepository.save(product);

        return product;
    }

    public async save(product: Product): Promise<Product> {
        return this.ormRepository.save(product);
    }

    public async updateQuantity(
        products: IUpdateProductQuantityDTO[],
    ): Promise<Product[]> {
        return this.ormRepository.save(products);
    }
}

export default ProductRepository;

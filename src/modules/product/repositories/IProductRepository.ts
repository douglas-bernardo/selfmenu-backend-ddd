import ICreateProductDTO from '../dtos/ICreateProductDTO';
import IFindAllProductsByCategoryIdDTO from '../dtos/IFindAllProductsByCategoryIdDTO';
import IFindAllProductsDTO from '../dtos/IFindAllProductsDTO';
import IFindByIdProductDTO from '../dtos/IFindByIdProductDTO';
import IFindByNameProductDTO from '../dtos/IFindByNameProductDTO';
import IUpdateProductsQuantityDTO from '../dtos/IUpdateProductQuantityDTO';
import Product from '../infra/typeorm/entities/Product';

interface IFindProducts {
    id: string;
}

interface ICountRecords {
    [key: string]: any;
}

export default interface IProductRepository {
    findAll(data: IFindAllProductsDTO): Promise<Product[]>;
    findAllByCategoryId(
        data: IFindAllProductsByCategoryIdDTO,
    ): Promise<Product[]>;
    findById(data: IFindByIdProductDTO): Promise<Product | undefined>;
    findByName(data: IFindByNameProductDTO): Promise<Product | undefined>;
    findAllByName(data: IFindByNameProductDTO): Promise<Product[]>;
    findAllById(
        products_ids: IFindProducts[],
        owner_id?: string,
    ): Promise<Product[]>;
    create(data: ICreateProductDTO): Promise<Product>;
    save(product: Product): Promise<Product>;
    updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]>;
    count(data: ICountRecords): Promise<number>;
}

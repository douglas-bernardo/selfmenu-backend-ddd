import ICreateTableDTO from '../dtos/ICreateTableDTO';
import IFindByCodeTableDTO from '../dtos/IFindByCodeTableDTO';
import IFindByIdTableDTO from '../dtos/IFindByIdTableDTO';
import Table from '../infra/typeorm/entities/Table';

export default interface ITableRepository {
    findAll(restaurant_id?: string): Promise<Table[]>;
    findById(data: IFindByIdTableDTO): Promise<Table | undefined>;
    findByCode(data: IFindByCodeTableDTO): Promise<Table | undefined>;
    create(data: ICreateTableDTO): Promise<Table>;
    save(table: Table): Promise<Table>;
}

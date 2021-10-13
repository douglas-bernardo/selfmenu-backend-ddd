import ICreateTableDTO from '../dtos/ICreateTableDTO';
import IFindAllTablesDTO from '../dtos/IFindAllTablesDTO';
import IFindByNumberTableDTO from '../dtos/IFindByNumberTableDTO';
import IFindByIdTableDTO from '../dtos/IFindByIdTableDTO';
import IFindByTokenTableDTO from '../dtos/IFindByTokenTableDTO';
import Table from '../infra/typeorm/entities/Table';

export default interface ITableRepository {
    findAll(data?: IFindAllTablesDTO): Promise<Table[]>;
    findById(data: IFindByIdTableDTO): Promise<Table | undefined>;
    findByNumber(data: IFindByNumberTableDTO): Promise<Table | undefined>;
    findLastCreated(restaurant_id: string): Promise<Table | undefined>;
    findByToken(data: IFindByTokenTableDTO): Promise<Table | undefined>;
    create(data: ICreateTableDTO): Promise<Table>;
    save(table: Table): Promise<Table>;
}

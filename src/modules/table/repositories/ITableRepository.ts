import ICreateTableDTO from '../dtos/ICreateTableDTO';
import IFindAllTablesDTO from '../dtos/IFindAllTablesDTO';
import IFindByCodeTableDTO from '../dtos/IFindByCodeTableDTO';
import IFindByIdTableDTO from '../dtos/IFindByIdTableDTO';
import IFindByTokenTableDTO from '../dtos/IFindByTokenTableDTO';
import Table from '../infra/typeorm/entities/Table';

export default interface ITableRepository {
    findAll(data?: IFindAllTablesDTO): Promise<Table[]>;
    findById(data: IFindByIdTableDTO): Promise<Table | undefined>;
    findByCode(data: IFindByCodeTableDTO): Promise<Table | undefined>;
    findByToken(data: IFindByTokenTableDTO): Promise<Table | undefined>;
    create(data: ICreateTableDTO): Promise<Table>;
    save(table: Table): Promise<Table>;
}

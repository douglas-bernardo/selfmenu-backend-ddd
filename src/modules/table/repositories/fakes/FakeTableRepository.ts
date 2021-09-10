import { v4 as uuid } from 'uuid';

import Table from '@modules/table/infra/typeorm/entities/Table';
import ICreateTableDTO from '@modules/table/dtos/ICreateTableDTO';
import IFindByCodeTableDTO from '@modules/table/dtos/IFindByCodeTableDTO';
import IFindByIdTableDTO from '@modules/table/dtos/IFindByIdTableDTO';
import IFindByTokenTableDTO from '@modules/table/dtos/IFindByTokenTableDTO';
import IFindAllTablesDTO from '@modules/table/dtos/IFindAllTablesDTO';
import ITableRepository from '../ITableRepository';

class FakeTableRepository implements ITableRepository {
    private tables: Table[] = [];

    public async findByToken({
        token_table,
    }: IFindByTokenTableDTO): Promise<Table | undefined> {
        const findTable = this.tables.find(
            table => table.token === token_table,
        );

        return findTable;
    }

    public async findAll({
        restaurant_id,
    }: IFindAllTablesDTO): Promise<Table[]> {
        let { tables } = this;

        if (restaurant_id) {
            tables = this.tables.filter(
                table => table.restaurant_id === restaurant_id,
            );
        }

        return tables;
    }

    public async findById({
        table_id,
        restaurant_id,
    }: IFindByIdTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;

        if (restaurant_id) {
            findTable = this.tables.find(
                table =>
                    table.id === table_id &&
                    table.restaurant_id === restaurant_id,
            );
        } else {
            findTable = this.tables.find(table => table.id === table_id);
        }

        return findTable;
    }

    public async findByCode({
        code,
        restaurant_id,
    }: IFindByCodeTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;

        if (restaurant_id) {
            findTable = this.tables.find(
                table =>
                    table.code === code &&
                    table.restaurant_id === restaurant_id,
            );
        } else {
            findTable = this.tables.find(table => table.code === code);
        }

        return findTable;
    }

    public async create(data: ICreateTableDTO): Promise<Table> {
        const table = new Table();

        Object.assign(table, { id: uuid(), active: true }, data);

        this.tables.push(table);
        return table;
    }

    public async save(table: Table): Promise<Table> {
        const findIndex = this.tables.findIndex(
            findTable => findTable.id === table.id,
        );

        this.tables[findIndex] = table;
        return table;
    }
}

export default FakeTableRepository;

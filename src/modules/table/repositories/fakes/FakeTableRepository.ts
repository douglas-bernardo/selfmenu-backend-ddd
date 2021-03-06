import { v4 as uuid } from 'uuid';

import Table from '@modules/table/infra/typeorm/entities/Table';
import ICreateTableDTO from '@modules/table/dtos/ICreateTableDTO';
import IFindByNumberTableDTO from '@modules/table/dtos/IFindByNumberTableDTO';
import IFindByIdTableDTO from '@modules/table/dtos/IFindByIdTableDTO';
import IFindByTokenTableDTO from '@modules/table/dtos/IFindByTokenTableDTO';
import IFindAllTablesDTO from '@modules/table/dtos/IFindAllTablesDTO';
import ITableRepository from '../ITableRepository';

class FakeTableRepository implements ITableRepository {
    private tables: Table[] = [];

    public async findLastCreated(
        establishment_id: string,
    ): Promise<Table | undefined> {
        let findTable: Table | undefined;

        const maxTableNumber = Math.max(
            ...this.tables.map(table => table.number),
        );

        if (maxTableNumber > 0) {
            findTable = this.tables.find(
                table =>
                    table.number === maxTableNumber &&
                    table.establishment_id === establishment_id,
            );
        }

        return findTable;
    }

    public async findByToken({
        table_token,
    }: IFindByTokenTableDTO): Promise<Table | undefined> {
        const findTable = this.tables.find(
            table => table.token === table_token,
        );

        return findTable;
    }

    public async findAll({ owner_id }: IFindAllTablesDTO): Promise<Table[]> {
        let { tables } = this;

        if (owner_id) {
            tables = this.tables.filter(table => table.owner_id === owner_id);
        }

        return tables;
    }

    public async findById({
        table_id,
        establishment_id,
    }: IFindByIdTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;

        if (establishment_id) {
            findTable = this.tables.find(
                table =>
                    table.id === table_id &&
                    table.establishment.id === establishment_id,
            );
        } else {
            findTable = this.tables.find(table => table.id === table_id);
        }

        return findTable;
    }

    public async findByNumber({
        number,
        establishment_id,
    }: IFindByNumberTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;

        if (establishment_id) {
            findTable = this.tables.find(
                table =>
                    table.number === number &&
                    table.establishment.id === establishment_id,
            );
        } else {
            findTable = this.tables.find(table => table.number === number);
        }

        return findTable;
    }

    public async create(data: ICreateTableDTO): Promise<Table> {
        const table = new Table();

        Object.assign(
            table,
            { id: uuid(), active: true, waiter_id: data.waiter.id },
            data,
        );

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

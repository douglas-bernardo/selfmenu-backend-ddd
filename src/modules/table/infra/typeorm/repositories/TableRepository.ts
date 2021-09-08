import Table from '@modules/table/infra/typeorm/entities/Table';
import ICreateTableDTO from '@modules/table/dtos/ICreateTableDTO';
import IFindByCodeTableDTO from '@modules/table/dtos/IFindByCodeTableDTO';
import IFindByIdTableDTO from '@modules/table/dtos/IFindByIdTableDTO';
import ITableRepository from '@modules/table/repositories/ITableRepository';
import { getRepository, Repository } from 'typeorm';
import IFindByTokenTableDTO from '@modules/table/dtos/IFindByTokenTableDTO';

class TableRepository implements ITableRepository {
    private ormRepository: Repository<Table>;

    constructor() {
        this.ormRepository = getRepository(Table);
    }

    public async findAll(restaurant_id?: string): Promise<Table[]> {
        let tables: Table[] = [];

        if (restaurant_id) {
            tables = await this.ormRepository.find({
                where: {
                    restaurant_id,
                },
            });
        } else {
            tables = await this.ormRepository.find();
        }

        return tables;
    }

    public async findById({
        table_id,
        restaurant_id,
    }: IFindByIdTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;

        if (restaurant_id) {
            findTable = await this.ormRepository.findOne({
                where: {
                    id: table_id,
                    restaurant_id,
                },
            });
        } else {
            findTable = await this.ormRepository.findOne(table_id);
        }

        return findTable;
    }

    public async findByCode({
        code,
        restaurant_id,
    }: IFindByCodeTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;

        if (restaurant_id) {
            findTable = await this.ormRepository.findOne({
                where: {
                    code,
                    restaurant_id,
                },
            });
        } else {
            findTable = await this.ormRepository.findOne({
                where: {
                    code,
                },
            });
        }

        return findTable;
    }

    public async findByToken({
        token_table,
    }: IFindByTokenTableDTO): Promise<Table | undefined> {
        const table = await this.ormRepository.findOne({
            where: {
                token: token_table,
            },
            relations: ['restaurant'],
        });

        return table;
    }

    public async create({
        code,
        capacity,
        restaurant_id,
        waiter_id,
    }: ICreateTableDTO): Promise<Table> {
        const table = this.ormRepository.create({
            code,
            capacity,
            restaurant_id,
            waiter_id,
        });

        await this.ormRepository.save(table);

        return table;
    }

    public async save(table: Table): Promise<Table> {
        return this.ormRepository.save(table);
    }
}

export default TableRepository;
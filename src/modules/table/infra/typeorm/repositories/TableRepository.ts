import Table from '@modules/table/infra/typeorm/entities/Table';
import ICreateTableDTO from '@modules/table/dtos/ICreateTableDTO';
import IFindByNumberTableDTO from '@modules/table/dtos/IFindByNumberTableDTO';
import IFindByIdTableDTO from '@modules/table/dtos/IFindByIdTableDTO';
import ITableRepository from '@modules/table/repositories/ITableRepository';
import { getRepository, Repository } from 'typeorm';
import IFindByTokenTableDTO from '@modules/table/dtos/IFindByTokenTableDTO';
import IFindAllTablesDTO from '@modules/table/dtos/IFindAllTablesDTO';

class TableRepository implements ITableRepository {
    private ormRepository: Repository<Table>;

    constructor() {
        this.ormRepository = getRepository(Table);
    }

    public async findAll({ owner_id }: IFindAllTablesDTO): Promise<Table[]> {
        let tables: Table[] = [];

        if (owner_id) {
            // tables = await this.ormRepository.find({
            //     where: {
            //         owner_id,
            //     },
            //     relations: ['waiter', 'orders', 'status_table'],
            //     order: {
            //         number: 'ASC',
            //     },
            // });
            tables = await this.ormRepository
                .createQueryBuilder('table')
                .leftJoinAndSelect('table.waiter', 'waiter')
                .leftJoinAndSelect('table.status_table', 'status_table')
                .leftJoinAndSelect('table.orders', 'orders')
                .select([
                    'table',
                    'waiter.name',
                    'waiter.avatar',
                    'status_table.name',
                    'orders.id',
                    'orders.status_order_id',
                ])
                .where('table.owner_id = :owner_id', { owner_id })
                .orderBy('table.number')
                .getMany();
        } else {
            tables = await this.ormRepository.find();
        }

        return tables;
    }

    public async findById({
        table_id,
        establishment_id,
    }: IFindByIdTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;

        if (establishment_id) {
            findTable = await this.ormRepository.findOne({
                where: {
                    id: table_id,
                    establishment_id,
                },
                relations: ['orders'],
            });
        } else {
            findTable = await this.ormRepository.findOne(table_id, {
                relations: ['orders'],
            });
        }

        return findTable;
    }

    public async findLastCreated(
        establishment_id: string,
    ): Promise<Table | undefined> {
        let findTable: Table | undefined;

        const query = this.ormRepository.createQueryBuilder('table');
        query.select('MAX(table.number)', 'max');
        const result = await query.getRawOne();

        if (result.max) {
            findTable = await this.ormRepository.findOne({
                where: {
                    number: result.max,
                    establishment_id,
                },
            });
        }

        return findTable;
    }

    public async findByNumber({
        number,
        establishment_id,
    }: IFindByNumberTableDTO): Promise<Table | undefined> {
        let findTable: Table | undefined;
        if (establishment_id) {
            findTable = await this.ormRepository.findOne({
                where: {
                    number,
                    establishment_id,
                },
            });
        } else {
            findTable = await this.ormRepository.findOne({
                where: {
                    number,
                },
            });
        }

        return findTable;
    }

    public async findByToken({
        table_token,
        table_id,
    }: IFindByTokenTableDTO): Promise<Table | undefined> {
        const table = await this.ormRepository.findOne({
            where: {
                id: table_id,
                token: table_token,
            },
            relations: ['establishment'],
        });

        return table;
    }

    public async create({
        number,
        capacity,
        establishment,
        waiter,
        owner,
    }: ICreateTableDTO): Promise<Table> {
        const table = this.ormRepository.create({
            number,
            capacity,
            establishment,
            waiter,
            owner,
        });

        await this.ormRepository.save(table);

        return table;
    }

    public async save(table: Table): Promise<Table> {
        return this.ormRepository.save(table);
    }
}

export default TableRepository;

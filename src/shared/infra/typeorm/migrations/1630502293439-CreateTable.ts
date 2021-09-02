import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTable1630502293439 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'table',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                    },
                    {
                        name: 'code',
                        type: 'varchar',
                    },
                    {
                        name: 'capacity',
                        type: 'int',
                    },
                    {
                        name: 'restaurant_id',
                        type: 'varchar',
                    },
                    {
                        name: 'waiter_id',
                        type: 'varchar',
                    },
                    {
                        name: 'available',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_table_restaurant',
                        columnNames: ['restaurant_id'],
                        referencedTableName: 'restaurant',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_table_waiter',
                        columnNames: ['waiter_id'],
                        referencedTableName: 'waiter',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('table');
    }
}

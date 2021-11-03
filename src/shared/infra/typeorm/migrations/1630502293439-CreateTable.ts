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
                        name: 'table_token',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'number',
                        type: 'int',
                    },
                    {
                        name: 'capacity',
                        type: 'int',
                    },
                    {
                        name: 'establishment_id',
                        type: 'varchar',
                    },
                    {
                        name: 'waiter_id',
                        type: 'varchar',
                    },
                    {
                        name: 'owner_id',
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
                        name: 'fk_table_establishment',
                        columnNames: ['establishment_id'],
                        referencedTableName: 'establishment',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_table_waiter',
                        columnNames: ['waiter_id'],
                        referencedTableName: 'waiter',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_table_account',
                        columnNames: ['owner_id'],
                        referencedTableName: 'account',
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

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrder1630500909222 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order',
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
                        name: 'status_order_id',
                        type: 'int',
                    },
                    {
                        name: 'establishment_id',
                        type: 'varchar',
                    },
                    {
                        name: 'owner_id',
                        type: 'varchar',
                    },
                    {
                        name: 'waiter_id',
                        type: 'varchar',
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
                        name: 'fk_order_status_order',
                        columnNames: ['status_order_id'],
                        referencedTableName: 'status_order',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_order_establishment',
                        columnNames: ['establishment_id'],
                        referencedTableName: 'establishment',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_order_account',
                        columnNames: ['owner_id'],
                        referencedTableName: 'account',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_order_waiter',
                        columnNames: ['waiter_id'],
                        referencedTableName: 'waiter',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('order');
    }
}

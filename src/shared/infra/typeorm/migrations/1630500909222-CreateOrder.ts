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
                        name: 'token',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status_order_id',
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
                        name: 'fk_order_restaurant',
                        columnNames: ['restaurant_id'],
                        referencedTableName: 'restaurant',
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

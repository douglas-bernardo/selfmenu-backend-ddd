import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrderProduct1630501746689
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order_product',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'order_id',
                        type: 'varchar',
                    },
                    {
                        name: 'product_id',
                        type: 'varchar',
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'discount',
                        type: 'decimal',
                        isNullable: true,
                    },
                    {
                        name: 'quantity',
                        type: 'int',
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
                        name: 'fk_order_product_order',
                        columnNames: ['order_id'],
                        referencedTableName: 'order',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_order_product_product',
                        columnNames: ['product_id'],
                        referencedTableName: 'product',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('order_product');
    }
}

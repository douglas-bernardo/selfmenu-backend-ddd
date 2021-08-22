import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateItem1629672056481 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'item',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'quantity',
                        type: 'int',
                    },
                    {
                        name: 'available',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'owner_id',
                        type: 'varchar',
                    },
                    {
                        name: 'category_id',
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
                        name: 'fk_item_restaurant',
                        columnNames: ['owner_id'],
                        referencedTableName: 'restaurant',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_item_category',
                        columnNames: ['category_id'],
                        referencedTableName: 'category',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('item');
    }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateMenuProduct1630005784619
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'menu_product',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'menu_id',
                        type: 'varchar',
                    },
                    {
                        name: 'product_id',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_menu_product_menu',
                        columnNames: ['menu_id'],
                        referencedTableName: 'menu',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_menu_product_product',
                        columnNames: ['product_id'],
                        referencedTableName: 'product',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('menu_product');
    }
}

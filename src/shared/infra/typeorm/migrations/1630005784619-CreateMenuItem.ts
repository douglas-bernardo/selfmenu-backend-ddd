import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateMenuItem1630005784619 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'menu_item',
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
                        name: 'item_id',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_menu_item_menu',
                        columnNames: ['menu_id'],
                        referencedTableName: 'menu',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_menu_item_item',
                        columnNames: ['item_id'],
                        referencedTableName: 'item',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('menu_item');
    }
}

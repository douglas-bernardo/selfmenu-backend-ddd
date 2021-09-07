import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export default class AddTableIdToOrder1630663496428
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'order',
            new TableColumn({
                name: 'table_id',
                type: 'varchar',
            }),
        );

        await queryRunner.createForeignKey(
            'order',
            new TableForeignKey({
                name: 'fk_order_table',
                columnNames: ['table_id'],
                referencedTableName: 'table',
                referencedColumnNames: ['id'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('order', 'fk_order_table');

        await queryRunner.dropColumn('order', 'table_id');
    }
}

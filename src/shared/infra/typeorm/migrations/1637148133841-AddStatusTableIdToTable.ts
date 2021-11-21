import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export default class AddStatusTableIdToTable1637148133841
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'table',
            new TableColumn({
                name: 'status_table_id',
                type: 'int',
                isNullable: false,
                default: 1,
            }),
        );

        await queryRunner.createForeignKey(
            'table',
            new TableForeignKey({
                name: 'fk_table_status_table',
                columnNames: ['status_table_id'],
                referencedTableName: 'status_table',
                referencedColumnNames: ['id'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('table', 'fk_table_status_table');

        await queryRunner.dropColumn('table', 'status_table_id');
    }
}

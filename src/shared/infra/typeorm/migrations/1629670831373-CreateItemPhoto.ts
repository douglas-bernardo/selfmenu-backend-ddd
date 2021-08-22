import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateItemPhoto1629670831373
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'item_photo',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'item_id',
                        type: 'varchar',
                    },
                    {
                        name: 'url',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_item_photo_item',
                        columnNames: ['item_id'],
                        referencedTableName: 'item',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('item_photo');
    }
}

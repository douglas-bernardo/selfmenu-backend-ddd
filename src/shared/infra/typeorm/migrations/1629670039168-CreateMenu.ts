import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateMenu1629670039168 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'menu',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'longtext',
                        isNullable: true,
                    },
                    {
                        name: 'owner_id',
                        type: 'varchar',
                    },
                    {
                        name: 'restaurant_id',
                        type: 'varchar',
                    },
                    {
                        name: 'active',
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
                        name: 'fk_menu_user',
                        columnNames: ['owner_id'],
                        referencedTableName: 'user',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_menu_restaurant',
                        columnNames: ['restaurant_id'],
                        referencedTableName: 'restaurant',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('menu');
    }
}

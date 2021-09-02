import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCategory1629670647959 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'category',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'owner_id',
                        type: 'varchar',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'fk_category_user',
                        columnNames: ['owner_id'],
                        referencedTableName: 'user',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('category');
    }
}

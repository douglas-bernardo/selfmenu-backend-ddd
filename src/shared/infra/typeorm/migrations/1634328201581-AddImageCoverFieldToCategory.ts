import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddImageCoverFieldToCategory1634328201581
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'category',
            new TableColumn({
                name: 'image_cover',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('category', 'image_cover');
    }
}

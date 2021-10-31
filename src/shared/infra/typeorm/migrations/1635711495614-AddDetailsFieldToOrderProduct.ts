import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDetailsFieldToOrderProduct1635711495614
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'order_product',
            new TableColumn({
                name: 'details',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('order_product', 'details');
    }
}

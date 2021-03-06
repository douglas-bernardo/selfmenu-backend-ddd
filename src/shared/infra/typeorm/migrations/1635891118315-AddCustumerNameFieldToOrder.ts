import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCustumerNameFieldToOrder1635891118315
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'order',
            new TableColumn({
                name: 'customer_name',
                type: 'varchar',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('order', 'customer_name');
    }
}

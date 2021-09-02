import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddActiveFieldToMenuItem1630100235625
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'menu_item',
            new TableColumn({
                name: 'active',
                type: 'boolean',
                default: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('menu_item', 'active');
    }
}

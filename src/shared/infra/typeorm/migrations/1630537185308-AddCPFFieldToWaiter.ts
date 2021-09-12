import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCPFFieldToWaiter1630537185308
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'waiter',
            new TableColumn({
                name: 'cpf',
                type: 'bigint',
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('waiter', 'cpf');
    }
}

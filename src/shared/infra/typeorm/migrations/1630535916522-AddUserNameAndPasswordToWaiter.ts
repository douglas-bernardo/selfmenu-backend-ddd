import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddUserNameAndPasswordToWaiter1630535916522
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'waiter',
            new TableColumn({
                name: 'username',
                type: 'varchar',
            }),
        );

        await queryRunner.addColumn(
            'waiter',
            new TableColumn({
                name: 'password',
                type: 'varchar',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('waiter', 'username');
        await queryRunner.dropColumn('waiter', 'password');
    }
}

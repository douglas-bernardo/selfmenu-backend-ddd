import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAccount1628540941178 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'account',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'user_id',
                        type: 'varchar',
                    },
                    {
                        name: 'plan_id',
                        type: 'int',
                    },
                    {
                        name: 'start_time',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'end_time',
                        type: 'timestamp',
                        isNullable: true,
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
                        name: 'fk_account_user',
                        columnNames: ['user_id'],
                        referencedTableName: 'user',
                        referencedColumnNames: ['id'],
                    },
                    {
                        name: 'fk_account_plan',
                        columnNames: ['plan_id'],
                        referencedTableName: 'plan',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('account');
    }
}

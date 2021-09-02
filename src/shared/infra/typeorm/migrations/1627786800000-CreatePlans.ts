import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreatePlans1627786800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'plan',
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
                        name: 'description',
                        type: 'varchar',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.query(
            `INSERT INTO plan (name, description) VALUES ('Free', 'Description of Free plan')`,
        );
        await queryRunner.query(
            `INSERT INTO plan (name, description) VALUES ('Premium', 'Description of Premium plan')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('plan');
    }
}

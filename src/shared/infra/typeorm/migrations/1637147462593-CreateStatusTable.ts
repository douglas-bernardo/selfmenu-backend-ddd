import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateStatusTable1637147462593
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'status_table',
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
                ],
            }),
        );

        await queryRunner.query(
            `INSERT INTO status_table (name) VALUES ('Disponível')`,
        );

        await queryRunner.query(
            `INSERT INTO status_table (name) VALUES ('Ocupada')`,
        );

        await queryRunner.query(
            `INSERT INTO status_table (name) VALUES ('Em Fechamento')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('status_table');
    }
}

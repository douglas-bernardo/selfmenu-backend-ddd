import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateStatusOrder1630500050295
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'status_order',
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
            `INSERT INTO status_order (name) VALUES ('Aceito')`,
        );

        await queryRunner.query(
            `INSERT INTO status_order (name) VALUES ('Em Preparação')`,
        );

        await queryRunner.query(
            `INSERT INTO status_order (name) VALUES ('Entregue')`,
        );

        await queryRunner.query(
            `INSERT INTO status_order (name) VALUES ('Encerrado')`,
        );

        await queryRunner.query(
            `INSERT INTO status_order (name) VALUES ('Cancelado')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('status_order');
    }
}

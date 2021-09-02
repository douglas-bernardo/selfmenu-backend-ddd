import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateRestaurantType1629571851212
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'restaurant_type',
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
            `INSERT INTO restaurant_type (name) VALUES ('Restaurante Típico')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Restaurante Grill')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Jantar Fino')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Pub')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Lanchonete')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Pastelaria')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Café ou Bistrô')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Food Truck')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Hamburgueria')`,
        );

        await queryRunner.query(
            `INSERT INTO restaurant_type (name) VALUES ('Pizzaria')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('restaurant_type');
    }
}

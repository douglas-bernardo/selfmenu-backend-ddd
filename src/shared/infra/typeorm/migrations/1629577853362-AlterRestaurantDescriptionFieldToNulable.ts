import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AlterRestaurantDescriptionFieldToNulable1629577853362
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE restaurant CHANGE COLUMN description description LONGTEXT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE restaurant CHANGE COLUMN description description LONGTEXT NOT NULL`,
        );
    }
}

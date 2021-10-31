import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AlterEstablishmentDescriptionFieldToNulable1629577853362
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE establishment CHANGE COLUMN description description LONGTEXT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE establishment CHANGE COLUMN description description LONGTEXT NOT NULL`,
        );
    }
}

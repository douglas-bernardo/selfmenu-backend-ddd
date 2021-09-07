import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AlterTableTokenFieldToNulable1630625165475
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `selfmenu`.`table` CHANGE COLUMN `token` `token` VARCHAR(255) NULL',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `selfmenu`.`table` CHANGE COLUMN `token` `token` VARCHAR(255) NOT NULL',
        );
    }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AlterTableAvailableFieldToActiveField1637148785570
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `table` CHANGE COLUMN available active TINYINT(1) NOT NULL DEFAULT 1',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `table` CHANGE COLUMN active available TINYINT(1) NOT NULL DEFAULT 1',
        );
    }
}

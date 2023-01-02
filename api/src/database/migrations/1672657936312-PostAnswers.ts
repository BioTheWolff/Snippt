import { MigrationInterface, QueryRunner } from "typeorm";

export class PostAnswers1672657936312 implements MigrationInterface {
    name = 'PostAnswers1672657936312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "parentId" integer`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_985731f28966e0d45a7bd9078a6" FOREIGN KEY ("parentId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_985731f28966e0d45a7bd9078a6"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "parentId"`);
    }

}

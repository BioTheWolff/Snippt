import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1671138934673 implements MigrationInterface {
    name = 'Initial1671138934673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "handle" character varying(30) NOT NULL, "display_name" character varying(40) NOT NULL, "email" character varying(80) NOT NULL, "password" character varying(255) NOT NULL, "disabled" boolean NOT NULL DEFAULT false, "admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_53197e5dba5dbaf94d29c8edbd3" UNIQUE ("handle"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(60) NOT NULL, "description" character varying(250) NOT NULL, "language" character varying(20) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "total_likes" integer NOT NULL DEFAULT '0', "total_dislikes" integer NOT NULL DEFAULT '0', "deleted" boolean NOT NULL DEFAULT false, "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_following_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_2c183a6c043a59133b516d5daa9" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9691163a986dfb589a90dea3d5" ON "user_following_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_a89f5a432c1edcd03a3b655532" ON "user_following_user" ("userId_2") `);
        await queryRunner.query(`CREATE TABLE "user_likes_post" ("userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_bca97478d4393dcad7ba1cd68ab" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_69928489f828d145c6881d86cf" ON "user_likes_post" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d403d90730d21cda920f4ad71b" ON "user_likes_post" ("postId") `);
        await queryRunner.query(`CREATE TABLE "user_dislikes_post" ("userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_fdbb52311baa5abf8a3e04cbd02" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_68dc04d5b7975282839166364d" ON "user_dislikes_post" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cbfd5fcb960bab01e2b56b0836" ON "user_dislikes_post" ("postId") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_9691163a986dfb589a90dea3d5f" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_a89f5a432c1edcd03a3b6555321" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_likes_post" ADD CONSTRAINT "FK_69928489f828d145c6881d86cff" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_likes_post" ADD CONSTRAINT "FK_d403d90730d21cda920f4ad71b1" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_dislikes_post" ADD CONSTRAINT "FK_68dc04d5b7975282839166364d3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_dislikes_post" ADD CONSTRAINT "FK_cbfd5fcb960bab01e2b56b08369" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_dislikes_post" DROP CONSTRAINT "FK_cbfd5fcb960bab01e2b56b08369"`);
        await queryRunner.query(`ALTER TABLE "user_dislikes_post" DROP CONSTRAINT "FK_68dc04d5b7975282839166364d3"`);
        await queryRunner.query(`ALTER TABLE "user_likes_post" DROP CONSTRAINT "FK_d403d90730d21cda920f4ad71b1"`);
        await queryRunner.query(`ALTER TABLE "user_likes_post" DROP CONSTRAINT "FK_69928489f828d145c6881d86cff"`);
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_a89f5a432c1edcd03a3b6555321"`);
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_9691163a986dfb589a90dea3d5f"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cbfd5fcb960bab01e2b56b0836"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68dc04d5b7975282839166364d"`);
        await queryRunner.query(`DROP TABLE "user_dislikes_post"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d403d90730d21cda920f4ad71b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69928489f828d145c6881d86cf"`);
        await queryRunner.query(`DROP TABLE "user_likes_post"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a89f5a432c1edcd03a3b655532"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9691163a986dfb589a90dea3d5"`);
        await queryRunner.query(`DROP TABLE "user_following_user"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

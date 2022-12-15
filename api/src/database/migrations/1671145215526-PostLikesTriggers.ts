import { MigrationInterface, QueryRunner } from "typeorm"

export class PostLikesTriggers1671145215526 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // likes
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION handle_user_likes() RETURNS TRIGGER AS $handle_user_likes$
                BEGIN
                    IF (TG_OP = 'DELETE') THEN
                        UPDATE post p 
                            SET total_likes = total_likes - 1
                            WHERE p.id = OLD.post_id;
                    ELSIF (TG_OP = 'INSERT') THEN
                        UPDATE post p 
                            SET total_likes = total_likes + 1
                            WHERE p.id = NEW.post_id;
                    END IF;
                    RETURN NULL;
                END;
            $handle_user_likes$ LANGUAGE plpgsql;
        `);
        await queryRunner.query(`
            CREATE TRIGGER user_likes
            AFTER INSERT OR DELETE ON user_likes_post
                FOR EACH ROW EXECUTE FUNCTION handle_user_likes();
        `);

        // dislikes
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION handle_user_dislikes() RETURNS TRIGGER AS $handle_user_dislikes$
                BEGIN
                    IF (TG_OP = 'DELETE') THEN
                        UPDATE post p 
                            SET total_dislikes = total_dislikes - 1
                            WHERE p.id = OLD.post_id;
                    ELSIF (TG_OP = 'INSERT') THEN
                        UPDATE post p 
                            SET total_dislikes = total_dislikes + 1
                            WHERE p.id = NEW.post_id;
                    END IF;
                    RETURN NULL;
                END;
            $handle_user_dislikes$ LANGUAGE plpgsql;
        `);
        await queryRunner.query(`
            CREATE TRIGGER user_dislikes
            AFTER INSERT OR DELETE ON user_dislikes_post
                FOR EACH ROW EXECUTE FUNCTION handle_user_dislikes();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TRIGGER IF EXISTS user_likes ON user_likes_post');
        await queryRunner.query('DROP TRIGGER IF EXISTS user_dislikes ON user_dislikes_post');

        await queryRunner.query('DROP FUNCTION IF EXISTS handle_user_likes');
        await queryRunner.query('DROP FUNCTION IF EXISTS handle_user_dislikes');
    }

}

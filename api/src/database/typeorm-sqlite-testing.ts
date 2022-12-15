import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { config } from 'dotenv';

config({ path: '.env.test' });

export const TypeOrmSqliteTestingModule = (
    entities: EntityClassOrSchema[]
) =>
    [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_TEST_HOST,
            port: parseInt(process.env.POSTGRES_TEST_PORT),
            username: process.env.POSTGRES_TEST_USERNAME,
            password: process.env.POSTGRES_TEST_PASSWORD,
            database: process.env.POSTGRES_TEST_DATABASE,
            entities: [
                __dirname + '/../**/entities/*.entity{.ts,.js}',
            ],
            synchronize: true,
            // migrations: [
            //     __dirname + './migrations/*{.ts,.js}'
            // ],
            // migrationsRun: true,
        }),
        TypeOrmModule.forFeature([...entities])
    ];
  
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

export const TypeOrmSqliteTestingModule = (
    entities: EntityClassOrSchema[]
    ) =>
        [
            TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                dropSchema: true,
                entities: entities,
                synchronize: true,
                }),
            TypeOrmModule.forFeature([...entities])
        ];
  
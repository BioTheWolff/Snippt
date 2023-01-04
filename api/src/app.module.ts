import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

require('dotenv').config();

@Module({
  imports: [
    // ORM module
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        __dirname + '/**/entities/*.entity{.ts,.js}',
      ],
      migrations: [
        __dirname + '/database/migrations/*{.ts,.js}'
      ],
      synchronize: (process.env.MODE === "devsync"),
    }),
    // API modules
    UsersModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

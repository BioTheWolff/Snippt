import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      synchronize: (process.env.MODE === "env"),
    }),
    // API modules
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

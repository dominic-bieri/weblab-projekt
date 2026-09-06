import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PhotoModule } from './photo/photo.module.js';
import { ChallengeModule } from './challenge/challenge.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo/photo.entity.js';
import { Challenge } from './challenge/challenge.entity.js';

@Module({
  imports: [
    PhotoModule,
    ChallengeModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Photo, Challenge],
      synchronize: true, // TODO remove synchronized
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { PhotoModule } from './photo/photo.module.js';
import { ChallengeModule } from './challenge/challenge.module.js';
import { StreakModule } from './streak/streak.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo/photo.entity.js';
import { Challenge } from './challenge/challenge.entity.js';

@Module({
  imports: [
    PhotoModule,
    ChallengeModule,
    StreakModule,
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
})
export class AppModule {}

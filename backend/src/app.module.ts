import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PhotoModule } from './photo/photo.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo/photo.entity.js';

@Module({
  imports: [
    PhotoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dailylens',
      password: 'dailylens_pw',
      database: 'daily_lens',
      entities: [Photo],
      synchronize: true, // TODO remove synchronized
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

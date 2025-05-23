import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PapersModule } from './papers/papers.module';
import { ConfigModule } from '@nestjs/config';
  @Module({
    imports: [
      PapersModule,
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
        type: 'postgres',
        url: process.env.TYPEORM_URL,
        autoLoadEntities: true,
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      }),
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PapersModule } from './papers/papers.module';

@Module({
  imports: [
    PapersModule,
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_TYPE as any,
      url: process.env.TYPEORM_URL,
      host: process.env.TYPEORM_HOST || 'localhost', // resolves to "db" in Docker
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

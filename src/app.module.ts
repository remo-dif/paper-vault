import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PapersModule } from './papers/papers.module';

function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  if (!config.TYPEORM_URL) {
    throw new Error('TYPEORM_URL is required');
  }

  return {
    ...config,
    PORT: config.PORT ?? '3000',
    TYPEORM_SYNCHRONIZE: config.TYPEORM_SYNCHRONIZE ?? 'false',
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('TYPEORM_URL'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
      }),
    }),
    PapersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

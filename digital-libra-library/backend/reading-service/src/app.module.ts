import { ConfigModule, ConfigService } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { ReadingProgressModule } from './reading-progress/reading-progress.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ReadingProgressModule,
    ConfigModule.forRoot({isGlobal: true, envFilePath: '../.env'}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
  ]
})
export class AppModule {}
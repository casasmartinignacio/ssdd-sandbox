import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: Number(config.get<string>('DATABASE_PORT', '5432')),
        username: config.get<string>('DATABASE_USER', 'alumnos'),
        password: config.get<string>('DATABASE_PASSWORD', 'alumnos'),
        database: config.get<string>('DATABASE_NAME', 'alumnos'),
        autoLoadEntities: true,
        synchronize: config.get<string>('DATABASE_SYNC', 'true') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { SaludController } from './salud/salud.controller';
import { SociosModule } from './socios/socios.module';

@Module({
  imports: [
    // La estructura de las tablas la crea db/init/01-schema.sql (no se usa synchronize)
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER ?? 'biblioteca',
      password: process.env.DB_PASSWORD ?? 'biblioteca',
      database: process.env.DB_NAME ?? 'biblioteca',
      timezone: 'Z',
      autoLoadEntities: true,
      synchronize: false,
    }),
    LibrosModule,
    SociosModule,
    PrestamosModule,
  ],
  controllers: [SaludController],
})
export class AppModule {}

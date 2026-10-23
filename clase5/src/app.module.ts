import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlumnosModule } from './alumnos/alumnos.module';
import { HealthController } from './health/health.controller';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { NotasModule } from './notas/notas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AlumnosModule,
    InscripcionesModule,
    NotasModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

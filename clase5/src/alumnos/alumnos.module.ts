import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { AlumnosController } from './alumnos.controller';
import { AlumnosService } from './alumnos.service';
import { Alumno } from './entities/alumno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alumno, Inscripcion])],
  controllers: [AlumnosController],
  providers: [AlumnosService],
  exports: [TypeOrmModule],
})
export class AlumnosModule {}

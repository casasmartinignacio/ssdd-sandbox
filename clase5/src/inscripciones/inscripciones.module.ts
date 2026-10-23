import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from '../alumnos/entities/alumno.entity';
import { Nota } from '../notas/entities/nota.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Alumno, Nota])],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
})
export class InscripcionesModule {}

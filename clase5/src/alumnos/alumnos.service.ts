import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JsonDb } from '../database/json-db';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { Alumno } from './entities/alumno.entity';

@Injectable()
export class AlumnosService {
  constructor(private readonly db: JsonDb) {}

  create(dto: CreateAlumnoDto): Promise<Alumno> {
    return this.db.update((data) => {
      const repetido = data.alumnos.some(
        (alumno) => alumno.email === dto.email || alumno.legajo === dto.legajo,
      );
      if (repetido) {
        throw new ConflictException(
          'Ya existe un alumno con ese email o legajo',
        );
      }
      const alumno: Alumno = {
        id: randomUUID(),
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        legajo: dto.legajo,
        creadoEn: new Date().toISOString(),
      };
      data.alumnos.push(alumno);
      return alumno;
    });
  }

  async findAll(): Promise<Alumno[]> {
    const data = await this.db.read();
    return [...data.alumnos].sort((a, b) =>
      b.creadoEn.localeCompare(a.creadoEn),
    );
  }

  async findOne(id: string): Promise<Alumno> {
    const data = await this.db.read();
    const alumno = data.alumnos.find((item) => item.id === id);
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return alumno;
  }

  update(id: string, dto: UpdateAlumnoDto): Promise<Alumno> {
    return this.db.update((data) => {
      const alumno = data.alumnos.find((item) => item.id === id);
      if (!alumno) throw new NotFoundException('Alumno no encontrado');

      const email = dto.email ?? alumno.email;
      const legajo = dto.legajo ?? alumno.legajo;
      const repetido = data.alumnos.some(
        (item) =>
          item.id !== id && (item.email === email || item.legajo === legajo),
      );
      if (repetido) {
        throw new ConflictException(
          'Ya existe un alumno con ese email o legajo',
        );
      }

      if (dto.nombre !== undefined) alumno.nombre = dto.nombre;
      if (dto.apellido !== undefined) alumno.apellido = dto.apellido;
      alumno.email = email;
      alumno.legajo = legajo;
      return alumno;
    });
  }

  remove(id: string): Promise<{ mensaje: string; id: string }> {
    return this.db.update((data) => {
      const index = data.alumnos.findIndex((item) => item.id === id);
      if (index === -1) throw new NotFoundException('Alumno no encontrado');
      const tieneInscripciones = data.inscripciones.some(
        (inscripcion) => inscripcion.alumnoId === id,
      );
      if (tieneInscripciones) {
        throw new ConflictException(
          'No se puede eliminar un alumno que tiene inscripciones',
        );
      }
      data.alumnos.splice(index, 1);
      return { mensaje: 'Alumno eliminado', id };
    });
  }
}

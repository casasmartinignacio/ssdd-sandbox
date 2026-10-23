import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Alumno } from '../alumnos/entities/alumno.entity';
import { DatabaseFile, InscripcionGuardada, JsonDb } from '../database/json-db';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';

@Injectable()
export class InscripcionesService {
  constructor(private readonly db: JsonDb) {}

  create(dto: CreateInscripcionDto): Promise<Inscripcion> {
    return this.db.update((data) => {
      const alumno = this.buscarAlumno(data, dto.alumnoId);
      this.asegurarUnica(data, {
        id: '',
        alumnoId: dto.alumnoId,
        materia: dto.materia,
        anio: dto.anio,
        cuatrimestre: dto.cuatrimestre,
      });
      const guardada: InscripcionGuardada = {
        id: randomUUID(),
        alumnoId: alumno.id,
        materia: dto.materia,
        anio: dto.anio,
        cuatrimestre: dto.cuatrimestre,
      };
      data.inscripciones.push(guardada);
      return this.conAlumno(guardada, alumno);
    });
  }

  async findAll(alumnoId?: string): Promise<Inscripcion[]> {
    const data = await this.db.read();
    return data.inscripciones
      .filter((item) => !alumnoId || item.alumnoId === alumnoId)
      .map((item) =>
        this.conAlumno(item, this.buscarAlumno(data, item.alumnoId)),
      )
      .sort((a, b) => b.anio - a.anio || b.cuatrimestre - a.cuatrimestre);
  }

  async findOne(id: string): Promise<Inscripcion> {
    const data = await this.db.read();
    const inscripcion = data.inscripciones.find((item) => item.id === id);
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return this.conAlumno(
      inscripcion,
      this.buscarAlumno(data, inscripcion.alumnoId),
    );
  }

  update(id: string, dto: UpdateInscripcionDto): Promise<Inscripcion> {
    return this.db.update((data) => {
      const inscripcion = data.inscripciones.find((item) => item.id === id);
      if (!inscripcion) {
        throw new NotFoundException('Inscripción no encontrada');
      }
      if (dto.alumnoId !== undefined) {
        this.buscarAlumno(data, dto.alumnoId);
        inscripcion.alumnoId = dto.alumnoId;
      }
      if (dto.materia !== undefined) inscripcion.materia = dto.materia;
      if (dto.anio !== undefined) inscripcion.anio = dto.anio;
      if (dto.cuatrimestre !== undefined) {
        inscripcion.cuatrimestre = dto.cuatrimestre;
      }
      this.asegurarUnica(data, inscripcion);
      return this.conAlumno(
        inscripcion,
        this.buscarAlumno(data, inscripcion.alumnoId),
      );
    });
  }

  remove(id: string): Promise<{ mensaje: string; id: string }> {
    return this.db.update((data) => {
      const index = data.inscripciones.findIndex((item) => item.id === id);
      if (index === -1)
        throw new NotFoundException('Inscripción no encontrada');
      const tieneNotas = data.notas.some((nota) => nota.inscripcionId === id);
      if (tieneNotas) {
        throw new ConflictException(
          'No se puede eliminar una inscripción que tiene notas',
        );
      }
      data.inscripciones.splice(index, 1);
      return { mensaje: 'Inscripción eliminada', id };
    });
  }

  private buscarAlumno(data: DatabaseFile, id: string): Alumno {
    const alumno = data.alumnos.find((item) => item.id === id);
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return alumno;
  }

  private asegurarUnica(data: DatabaseFile, actual: InscripcionGuardada): void {
    const repetida = data.inscripciones.some(
      (item) =>
        item.id !== actual.id &&
        item.alumnoId === actual.alumnoId &&
        item.materia === actual.materia &&
        item.anio === actual.anio &&
        item.cuatrimestre === actual.cuatrimestre,
    );
    if (repetida) {
      throw new ConflictException(
        'El alumno ya está inscripto en esa materia para ese período',
      );
    }
  }

  private conAlumno(
    inscripcion: InscripcionGuardada,
    alumno: Alumno,
  ): Inscripcion {
    return {
      id: inscripcion.id,
      materia: inscripcion.materia,
      anio: inscripcion.anio,
      cuatrimestre: inscripcion.cuatrimestre,
      alumno,
    };
  }
}

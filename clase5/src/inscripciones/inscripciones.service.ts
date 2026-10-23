import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from '../alumnos/entities/alumno.entity';
import { esClaveDuplicada } from '../common/es-clave-duplicada';
import { Nota } from '../notas/entities/nota.entity';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripciones: Repository<Inscripcion>,
    @InjectRepository(Alumno)
    private readonly alumnos: Repository<Alumno>,
    @InjectRepository(Nota)
    private readonly notas: Repository<Nota>,
  ) {}

  async create(dto: CreateInscripcionDto): Promise<Inscripcion> {
    const alumno = await this.alumnos.findOneBy({ id: dto.alumnoId });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    const inscripcion = this.inscripciones.create({
      materia: dto.materia,
      anio: dto.anio,
      cuatrimestre: dto.cuatrimestre,
      alumno,
    });

    try {
      return await this.inscripciones.save(inscripcion);
    } catch (error) {
      if (esClaveDuplicada(error)) {
        throw new ConflictException(
          'El alumno ya está inscripto en esa materia para ese período',
        );
      }
      throw error;
    }
  }

  findAll(alumnoId?: string): Promise<Inscripcion[]> {
    return this.inscripciones.find({
      where: alumnoId ? { alumno: { id: alumnoId } } : {},
      relations: { alumno: true },
      order: { anio: 'DESC', cuatrimestre: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Inscripcion> {
    const inscripcion = await this.inscripciones.findOne({
      where: { id },
      relations: { alumno: true },
    });
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  async update(id: string, dto: UpdateInscripcionDto): Promise<Inscripcion> {
    const inscripcion = await this.findOne(id);
    if (dto.alumnoId) {
      const alumno = await this.alumnos.findOneBy({ id: dto.alumnoId });
      if (!alumno) throw new NotFoundException('Alumno no encontrado');
      inscripcion.alumno = alumno;
    }
    if (dto.materia !== undefined) inscripcion.materia = dto.materia;
    if (dto.anio !== undefined) inscripcion.anio = dto.anio;
    if (dto.cuatrimestre !== undefined) {
      inscripcion.cuatrimestre = dto.cuatrimestre;
    }

    try {
      return await this.inscripciones.save(inscripcion);
    } catch (error) {
      if (esClaveDuplicada(error)) {
        throw new ConflictException(
          'El alumno ya está inscripto en esa materia para ese período',
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ mensaje: string; id: string }> {
    await this.findOne(id);
    const notas = await this.notas.count({ where: { inscripcion: { id } } });
    if (notas > 0) {
      throw new ConflictException(
        'No se puede eliminar una inscripción que tiene notas',
      );
    }
    await this.inscripciones.delete(id);
    return { mensaje: 'Inscripción eliminada', id };
  }
}

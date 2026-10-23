import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { esClaveDuplicada } from '../common/es-clave-duplicada';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { Alumno } from './entities/alumno.entity';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private readonly alumnos: Repository<Alumno>,
    @InjectRepository(Inscripcion)
    private readonly inscripciones: Repository<Inscripcion>,
  ) {}

  async create(dto: CreateAlumnoDto): Promise<Alumno> {
    try {
      return await this.alumnos.save(this.alumnos.create(dto));
    } catch (error) {
      if (esClaveDuplicada(error)) {
        throw new ConflictException(
          'Ya existe un alumno con ese email o legajo',
        );
      }
      throw error;
    }
  }

  findAll(): Promise<Alumno[]> {
    return this.alumnos.find({ order: { creadoEn: 'DESC' } });
  }

  async findOne(id: string): Promise<Alumno> {
    const alumno = await this.alumnos.findOneBy({ id });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');
    return alumno;
  }

  async update(id: string, dto: UpdateAlumnoDto): Promise<Alumno> {
    const alumno = await this.findOne(id);
    Object.assign(alumno, dto);
    try {
      return await this.alumnos.save(alumno);
    } catch (error) {
      if (esClaveDuplicada(error)) {
        throw new ConflictException(
          'Ya existe un alumno con ese email o legajo',
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ mensaje: string; id: string }> {
    await this.findOne(id);
    const inscripciones = await this.inscripciones.count({
      where: { alumno: { id } },
    });
    if (inscripciones > 0) {
      throw new ConflictException(
        'No se puede eliminar un alumno que tiene inscripciones',
      );
    }
    await this.alumnos.delete(id);
    return { mensaje: 'Alumno eliminado', id };
  }
}

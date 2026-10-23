import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Nota } from './entities/nota.entity';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private readonly notas: Repository<Nota>,
    @InjectRepository(Inscripcion)
    private readonly inscripciones: Repository<Inscripcion>,
  ) {}

  async create(dto: CreateNotaDto): Promise<Nota> {
    const inscripcion = await this.inscripciones.findOneBy({
      id: dto.inscripcionId,
    });
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');

    return this.notas.save(
      this.notas.create({
        valor: dto.valor,
        instancia: dto.instancia,
        fecha: dto.fecha.slice(0, 10),
        inscripcion,
      }),
    );
  }

  findAll(inscripcionId?: string): Promise<Nota[]> {
    return this.notas.find({
      where: inscripcionId ? { inscripcion: { id: inscripcionId } } : {},
      relations: { inscripcion: true },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Nota> {
    const nota = await this.notas.findOne({
      where: { id },
      relations: { inscripcion: true },
    });
    if (!nota) throw new NotFoundException('Nota no encontrada');
    return nota;
  }

  async update(id: string, dto: UpdateNotaDto): Promise<Nota> {
    const nota = await this.findOne(id);
    if (dto.inscripcionId) {
      const inscripcion = await this.inscripciones.findOneBy({
        id: dto.inscripcionId,
      });
      if (!inscripcion) {
        throw new NotFoundException('Inscripción no encontrada');
      }
      nota.inscripcion = inscripcion;
    }
    if (dto.valor !== undefined) nota.valor = dto.valor;
    if (dto.instancia !== undefined) nota.instancia = dto.instancia;
    if (dto.fecha !== undefined) nota.fecha = dto.fecha.slice(0, 10);
    return this.notas.save(nota);
  }

  async remove(id: string): Promise<{ mensaje: string; id: string }> {
    await this.findOne(id);
    await this.notas.delete(id);
    return { mensaje: 'Nota eliminada', id };
  }
}

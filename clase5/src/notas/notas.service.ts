import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseFile, JsonDb, NotaGuardada } from '../database/json-db';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Nota } from './entities/nota.entity';

@Injectable()
export class NotasService {
  constructor(private readonly db: JsonDb) {}

  create(dto: CreateNotaDto): Promise<Nota> {
    return this.db.update((data) => {
      const inscripcion = this.buscarInscripcion(data, dto.inscripcionId);
      const nota: NotaGuardada = {
        id: randomUUID(),
        inscripcionId: inscripcion.id,
        valor: dto.valor,
        instancia: dto.instancia,
        fecha: dto.fecha.slice(0, 10),
      };
      data.notas.push(nota);
      return this.conInscripcion(nota, inscripcion);
    });
  }

  async findAll(inscripcionId?: string): Promise<Nota[]> {
    const data = await this.db.read();
    return data.notas
      .filter((nota) => !inscripcionId || nota.inscripcionId === inscripcionId)
      .map((nota) =>
        this.conInscripcion(
          nota,
          this.buscarInscripcion(data, nota.inscripcionId),
        ),
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async findOne(id: string): Promise<Nota> {
    const data = await this.db.read();
    const nota = data.notas.find((item) => item.id === id);
    if (!nota) throw new NotFoundException('Nota no encontrada');
    return this.conInscripcion(
      nota,
      this.buscarInscripcion(data, nota.inscripcionId),
    );
  }

  update(id: string, dto: UpdateNotaDto): Promise<Nota> {
    return this.db.update((data) => {
      const nota = data.notas.find((item) => item.id === id);
      if (!nota) throw new NotFoundException('Nota no encontrada');
      if (dto.inscripcionId !== undefined) {
        this.buscarInscripcion(data, dto.inscripcionId);
        nota.inscripcionId = dto.inscripcionId;
      }
      if (dto.valor !== undefined) nota.valor = dto.valor;
      if (dto.instancia !== undefined) nota.instancia = dto.instancia;
      if (dto.fecha !== undefined) nota.fecha = dto.fecha.slice(0, 10);
      return this.conInscripcion(
        nota,
        this.buscarInscripcion(data, nota.inscripcionId),
      );
    });
  }

  remove(id: string): Promise<{ mensaje: string; id: string }> {
    return this.db.update((data) => {
      const index = data.notas.findIndex((item) => item.id === id);
      if (index === -1) throw new NotFoundException('Nota no encontrada');
      data.notas.splice(index, 1);
      return { mensaje: 'Nota eliminada', id };
    });
  }

  private buscarInscripcion(data: DatabaseFile, id: string) {
    const inscripcion = data.inscripciones.find((item) => item.id === id);
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  private conInscripcion(
    nota: NotaGuardada,
    inscripcion: DatabaseFile['inscripciones'][number],
  ): Nota {
    return {
      id: nota.id,
      valor: nota.valor,
      instancia: nota.instancia,
      fecha: nota.fecha,
      inscripcion: {
        id: inscripcion.id,
        materia: inscripcion.materia,
        anio: inscripcion.anio,
        cuatrimestre: inscripcion.cuatrimestre,
      },
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { Libro } from './entities/libro.entity';
import { LibrosRepository } from './libros.repository';

@Injectable()
export class LibrosService {
  constructor(private readonly repo: LibrosRepository) {}

  create(dto: CrearLibroDto): Libro {
    return this.repo.create(dto);
  }

  findAll(): Libro[] {
    return this.repo.findAll();
  }

  findOne(id: number): Libro {
    const libro = this.repo.findById(id);
    if (!libro) throw new NotFoundException(`El libro ${id} no existe`);
    return libro;
  }

  update(id: number, dto: ActualizarLibroDto): Libro {
    const libro = this.repo.update(id, dto);
    if (!libro) throw new NotFoundException(`El libro ${id} no existe`);
    return libro;
  }

  remove(id: number): void {
    if (!this.repo.remove(id)) {
      throw new NotFoundException(`El libro ${id} no existe`);
    }
  }

  // Suma (o resta, si es negativo) ejemplares disponibles
  ajustarDisponibles(id: number, delta: number): Libro {
    const libro = this.findOne(id);
    return this.repo.update(id, { disponibles: libro.disponibles + delta })!;
  }
}

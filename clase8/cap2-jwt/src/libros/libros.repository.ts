import { Injectable } from '@nestjs/common';
import { Libro } from './entities/libro.entity';
import { CrearLibroDto } from './dto/crear-libro.dto';

@Injectable()
export class LibrosRepository {
  private libros: Libro[] = [];
  private siguienteId = 1;

  create(datos: CrearLibroDto): Libro {
    const libro: Libro = {
      id: this.siguienteId++,
      ...datos,
      disponibles: datos.ejemplares,
    };
    this.libros.push(libro);
    return libro;
  }

  findAll(): Libro[] {
    return [...this.libros];
  }

  findById(id: number): Libro | undefined {
    return this.libros.find((l) => l.id === id);
  }

  update(id: number, cambios: Partial<Libro>): Libro | undefined {
    const libro = this.findById(id);
    if (libro) Object.assign(libro, cambios);
    return libro;
  }

  remove(id: number): boolean {
    const antes = this.libros.length;
    this.libros = this.libros.filter((l) => l.id !== id);
    return this.libros.length < antes;
  }
}

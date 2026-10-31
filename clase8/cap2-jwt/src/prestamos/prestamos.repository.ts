import { Injectable } from '@nestjs/common';
import { Prestamo } from './entities/prestamo.entity';

@Injectable()
export class PrestamosRepository {
  private prestamos: Prestamo[] = [];
  private siguienteId = 1;

  create(datos: Omit<Prestamo, 'id'>): Prestamo {
    const prestamo: Prestamo = { id: this.siguienteId++, ...datos };
    this.prestamos.push(prestamo);
    return prestamo;
  }

  findAll(): Prestamo[] {
    return [...this.prestamos];
  }

  findById(id: number): Prestamo | undefined {
    return this.prestamos.find((p) => p.id === id);
  }

  findActivosPorSocio(socioId: number): Prestamo[] {
    return this.prestamos.filter(
      (p) => p.socioId === socioId && p.devueltoEn === null,
    );
  }

  save(prestamo: Prestamo): Prestamo {
    return prestamo; // en memoria: el objeto ya es la fuente de verdad
  }
}

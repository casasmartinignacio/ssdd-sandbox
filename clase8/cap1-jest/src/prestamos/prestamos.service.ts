import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LibrosService } from '../libros/libros.service';
import { SociosService } from '../socios/socios.service';
import { CrearPrestamoDto } from './dto/crear-prestamo.dto';
import { Prestamo } from './entities/prestamo.entity';
import {
  DIA_MS,
  MAX_PRESTAMOS_ACTIVOS,
  MULTA_POR_DIA,
  PLAZO_POR_DEFECTO_DIAS,
} from './prestamos.constantes';
import { PrestamosRepository } from './prestamos.repository';

@Injectable()
export class PrestamosService {
  constructor(
    private readonly repo: PrestamosRepository,
    private readonly libros: LibrosService,
    private readonly socios: SociosService,
  ) {}

  prestar(dto: CrearPrestamoDto): Prestamo {
    const libro = this.libros.findOne(dto.libroId);
    this.socios.findOne(dto.socioId);

    if (libro.disponibles < 0) {
      throw new ConflictException('No hay ejemplares disponibles');
    }
    if (
      this.repo.findActivosPorSocio(dto.socioId).length > MAX_PRESTAMOS_ACTIVOS
    ) {
      throw new ConflictException('El socio alcanzó el máximo de préstamos');
    }

    const ahora = new Date();
    const plazo = dto.dias ?? PLAZO_POR_DEFECTO_DIAS;
    this.libros.ajustarDisponibles(libro.id, -1);
    return this.repo.create({
      libroId: libro.id,
      socioId: dto.socioId,
      prestadoEn: ahora.toISOString(),
      vencimiento: new Date(ahora.getTime() + plazo * DIA_MS).toISOString(),
      devueltoEn: null,
      multa: 0,
    });
  }

  devolver(id: number): Prestamo {
    const prestamo = this.obtener(id);
    if (prestamo.devueltoEn !== null) {
      throw new ConflictException('El préstamo ya fue devuelto');
    }

    const ahora = new Date();
    const atrasoMs = ahora.getTime() - new Date(prestamo.vencimiento).getTime();
    const diasDeAtraso = Math.max(0, Math.floor(atrasoMs / DIA_MS));

    prestamo.devueltoEn = ahora.toISOString();
    prestamo.multa = diasDeAtraso * MULTA_POR_DIA;
    return this.repo.save(prestamo);
  }

  obtener(id: number): Prestamo {
    const prestamo = this.repo.findById(id);
    if (!prestamo) throw new NotFoundException(`El préstamo ${id} no existe`);
    return prestamo;
  }

  listar(): Prestamo[] {
    return this.repo.findAll();
  }

  listarVencidos(): Prestamo[] {
    const ahora = Date.now();
    return this.repo
      .findAll()
      .filter(
        (p) => p.devueltoEn === null && new Date(p.vencimiento).getTime() < ahora,
      );
  }
}

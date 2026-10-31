import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { Libro } from './entities/libro.entity';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro) private readonly repo: Repository<Libro>,
  ) {}

  create(dto: CrearLibroDto): Promise<Libro> {
    return this.repo.save(this.repo.create({ ...dto, disponibles: dto.ejemplares }));
  }

  findAll(): Promise<Libro[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.repo.findOneBy({ id });
    if (!libro) throw new NotFoundException(`El libro ${id} no existe`);
    return libro;
  }

  async update(id: number, dto: ActualizarLibroDto): Promise<Libro> {
    const libro = await this.findOne(id);
    return this.repo.save(Object.assign(libro, dto));
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.repo.delete(id);
    if (!affected) throw new NotFoundException(`El libro ${id} no existe`);
  }

  // Suma (o resta, si es negativo) ejemplares disponibles
  async ajustarDisponibles(id: number, delta: number): Promise<Libro> {
    const libro = await this.findOne(id);
    libro.disponibles += delta;
    return this.repo.save(libro);
  }
}

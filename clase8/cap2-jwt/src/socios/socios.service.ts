import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CrearSocioDto } from './dto/crear-socio.dto';
import { Socio } from './entities/socio.entity';
import { SociosRepository } from './socios.repository';

@Injectable()
export class SociosService {
  constructor(private readonly repo: SociosRepository) {}

  create(dto: CrearSocioDto): Socio {
    if (this.repo.findByEmail(dto.email)) {
      throw new ConflictException('Ya existe un socio con ese email');
    }
    return this.repo.create(dto);
  }

  findAll(): Socio[] {
    return this.repo.findAll();
  }

  findOne(id: number): Socio {
    const socio = this.repo.findById(id);
    if (!socio) throw new NotFoundException(`El socio ${id} no existe`);
    return socio;
  }
}

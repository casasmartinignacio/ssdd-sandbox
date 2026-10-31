import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearSocioDto } from './dto/crear-socio.dto';
import { Socio } from './entities/socio.entity';

@Injectable()
export class SociosService {
  constructor(
    @InjectRepository(Socio) private readonly repo: Repository<Socio>,
  ) {}

  async create(dto: CrearSocioDto): Promise<Socio> {
    if (await this.repo.existsBy({ email: dto.email })) {
      throw new ConflictException('Ya existe un socio con ese email');
    }
    return this.repo.save(this.repo.create(dto));
  }

  findAll(): Promise<Socio[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Socio> {
    const socio = await this.repo.findOneBy({ id });
    if (!socio) throw new NotFoundException(`El socio ${id} no existe`);
    return socio;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Nota } from './entities/nota.entity';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nota, Inscripcion])],
  controllers: [NotasController],
  providers: [NotasService],
})
export class NotasModule {}

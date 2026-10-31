import { Module } from '@nestjs/common';
import { LibrosModule } from '../libros/libros.module';
import { SociosModule } from '../socios/socios.module';
import { PrestamosController } from './prestamos.controller';
import { PrestamosRepository } from './prestamos.repository';
import { PrestamosService } from './prestamos.service';

@Module({
  imports: [LibrosModule, SociosModule],
  controllers: [PrestamosController],
  providers: [PrestamosService, PrestamosRepository],
  exports: [PrestamosService],
})
export class PrestamosModule {}

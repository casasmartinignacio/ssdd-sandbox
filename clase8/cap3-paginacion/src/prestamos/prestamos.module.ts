import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosModule } from '../libros/libros.module';
import { SociosModule } from '../socios/socios.module';
import { Prestamo } from './entities/prestamo.entity';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prestamo]), LibrosModule, SociosModule],
  controllers: [PrestamosController],
  providers: [PrestamosService],
  exports: [PrestamosService],
})
export class PrestamosModule {}

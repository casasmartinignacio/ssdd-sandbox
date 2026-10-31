import { Module } from '@nestjs/common';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { SaludController } from './salud/salud.controller';
import { SociosModule } from './socios/socios.module';

@Module({
  imports: [LibrosModule, SociosModule, PrestamosModule],
  controllers: [SaludController],
})
export class AppModule {}

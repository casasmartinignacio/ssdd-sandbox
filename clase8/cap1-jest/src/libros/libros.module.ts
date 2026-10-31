import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';
import { LibrosRepository } from './libros.repository';
import { LibrosService } from './libros.service';

@Module({
  controllers: [LibrosController],
  providers: [LibrosService, LibrosRepository],
  exports: [LibrosService],
})
export class LibrosModule {}

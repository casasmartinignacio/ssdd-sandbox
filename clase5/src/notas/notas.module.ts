import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { NotasController } from './notas.controller';
import { NotasService } from './notas.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NotasController],
  providers: [NotasService],
})
export class NotasModule {}

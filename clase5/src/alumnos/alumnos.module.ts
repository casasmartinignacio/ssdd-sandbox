import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AlumnosController } from './alumnos.controller';
import { AlumnosService } from './alumnos.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AlumnosController],
  providers: [AlumnosService],
})
export class AlumnosModule {}

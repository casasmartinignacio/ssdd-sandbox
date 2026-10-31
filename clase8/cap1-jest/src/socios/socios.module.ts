import { Module } from '@nestjs/common';
import { SociosController } from './socios.controller';
import { SociosRepository } from './socios.repository';
import { SociosService } from './socios.service';

@Module({
  controllers: [SociosController],
  providers: [SociosService, SociosRepository],
  exports: [SociosService],
})
export class SociosModule {}

import { Controller, Get } from '@nestjs/common';

@Controller('salud')
export class SaludController {
  @Get()
  estado() {
    return { estado: 'ok', instancia: process.env.INSTANCIA ?? 'local' };
  }
}

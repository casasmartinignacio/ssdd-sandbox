import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ schema: { example: { estado: 'ok' } } })
  check() {
    return { estado: 'ok' };
  }
}

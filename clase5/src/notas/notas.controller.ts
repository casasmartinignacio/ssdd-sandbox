import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { NotasService } from './notas.service';

@ApiTags('notas')
@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  create(@Body() dto: CreateNotaDto) {
    return this.notasService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'inscripcionId', required: false })
  findAll(
    @Query('inscripcionId', new ParseUUIDPipe({ optional: true }))
    inscripcionId?: string,
  ) {
    return this.notasService.findAll(inscripcionId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNotaDto) {
    return this.notasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notasService.remove(id);
  }
}

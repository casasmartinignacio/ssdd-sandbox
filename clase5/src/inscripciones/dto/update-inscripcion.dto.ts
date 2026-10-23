import { PartialType } from '@nestjs/swagger';
import { CreateInscripcionDto } from './create-inscripcion.dto';

export class UpdateInscripcionDto extends PartialType(CreateInscripcionDto) {}

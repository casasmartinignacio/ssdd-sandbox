import { PartialType } from '@nestjs/mapped-types';
import { CrearLibroDto } from './crear-libro.dto';

export class ActualizarLibroDto extends PartialType(CrearLibroDto) {}

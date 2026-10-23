import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateInscripcionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  alumnoId: string;

  @ApiProperty({ example: 'Matemática I' })
  @IsString()
  @IsNotEmpty({ message: 'La materia es obligatoria' })
  @MaxLength(120)
  materia: string;

  @ApiProperty({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  anio: number;

  @ApiProperty({ example: 1, description: '1 o 2' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2)
  cuatrimestre: number;
}

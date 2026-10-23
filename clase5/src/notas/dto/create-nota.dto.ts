import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { InstanciaNota } from '../entities/nota.entity';

export class CreateNotaDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  inscripcionId: string;

  @ApiProperty({ example: 8, minimum: 0, maximum: 10 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  valor: number;

  @ApiProperty({ enum: InstanciaNota, example: InstanciaNota.PARCIAL })
  @IsEnum(InstanciaNota, {
    message: 'La instancia debe ser parcial, recuperatorio, final o tp',
  })
  instancia: InstanciaNota;

  @ApiProperty({ example: '2026-06-15' })
  @IsDateString()
  fecha: string;
}

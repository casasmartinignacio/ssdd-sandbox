import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAlumnoDto {
  @ApiProperty({ example: 'Ana' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(80)
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(80)
  apellido: string;

  @ApiProperty({ example: 'ana.perez@correo.edu' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: 'A-1024' })
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'El legajo es obligatorio' })
  @MaxLength(20)
  legajo: string;
}

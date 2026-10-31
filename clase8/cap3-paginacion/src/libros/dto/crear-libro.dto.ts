import { IsInt, IsString, Length, Max, Min, MinLength } from 'class-validator';

export class CrearLibroDto {
  @IsString()
  @MinLength(2)
  titulo: string;

  @IsString()
  @MinLength(2)
  autor: string;

  @IsString()
  @Length(10, 17)
  isbn: string;

  @IsString()
  @MinLength(2)
  categoria: string;

  @IsInt()
  @Min(1450)
  @Max(2100)
  anio: number;

  @IsInt()
  @Min(1)
  @Max(100)
  ejemplares: number;
}

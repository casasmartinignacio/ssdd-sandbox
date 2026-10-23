import { Alumno } from '../../alumnos/entities/alumno.entity';

export type Inscripcion = {
  id: string;
  materia: string;
  anio: number;
  cuatrimestre: number;
  alumno: Alumno;
};

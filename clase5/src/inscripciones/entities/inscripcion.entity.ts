import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Alumno } from '../../alumnos/entities/alumno.entity';
import { Nota } from '../../notas/entities/nota.entity';

@Entity('inscripciones')
@Unique(['alumno', 'materia', 'anio', 'cuatrimestre'])
export class Inscripcion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  materia: string;

  @Column()
  anio: number;

  @Column()
  cuatrimestre: number;

  @ManyToOne(() => Alumno, (alumno) => alumno.inscripciones, {
    onDelete: 'RESTRICT',
  })
  alumno: Alumno;

  @OneToMany(() => Nota, (nota) => nota.inscripcion)
  notas: Nota[];
}

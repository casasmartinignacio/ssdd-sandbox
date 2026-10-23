import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';

@Entity('alumnos')
export class Alumno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  legajo: string;

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.alumno)
  inscripciones: Inscripcion[];
}

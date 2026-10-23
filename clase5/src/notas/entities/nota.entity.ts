import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';

export enum InstanciaNota {
  PARCIAL = 'parcial',
  RECUPERATORIO = 'recuperatorio',
  FINAL = 'final',
  TP = 'tp',
}

@Entity('notas')
export class Nota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  valor: number;

  @Column({ type: 'enum', enum: InstanciaNota })
  instancia: InstanciaNota;

  @Column({ type: 'date' })
  fecha: string;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.notas, {
    onDelete: 'RESTRICT',
  })
  inscripcion: Inscripcion;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('socios')
export class Socio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nombre: string;

  @Column({ length: 160, unique: true })
  email: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ length: 120 })
  autor: string;

  @Column({ length: 17 })
  isbn: string;

  @Column({ length: 60 })
  categoria: string;

  @Column({ type: 'smallint' })
  anio: number;

  @Column({ type: 'smallint' })
  ejemplares: number;

  @Column({ type: 'smallint' })
  disponibles: number;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('prestamos')
export class Prestamo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'libro_id' })
  libroId: number;

  @Column({ name: 'socio_id' })
  socioId: number;

  @Column({ name: 'prestado_en', type: 'datetime' })
  prestadoEn: Date;

  @Column({ type: 'datetime' })
  vencimiento: Date;

  @Column({ name: 'devuelto_en', type: 'datetime', nullable: true })
  devueltoEn: Date | null;

  @Column({ default: 0 })
  multa: number;
}

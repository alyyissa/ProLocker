import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: 'Standard Delivery' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
}

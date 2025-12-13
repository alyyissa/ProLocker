import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  text: string; // The banner message

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // If the banner is visible
}
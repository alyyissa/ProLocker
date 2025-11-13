import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        })
    name: string;

    @Column({
        type: 'int',
        nullable: false,
    })
    price: number

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

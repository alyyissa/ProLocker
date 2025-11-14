import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100
    })
    name: string
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Color {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "varchar",
        length: 30,
        nullable: false
    })
    color: string
}

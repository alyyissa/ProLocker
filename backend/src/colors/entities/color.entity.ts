import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Color {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "char",
        length: 30,
        nullable: false
    })
    color: string
}

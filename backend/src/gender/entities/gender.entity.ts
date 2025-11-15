import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gender {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'char',
        length: '50',
        nullable: false
    })
    gender:string
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Size {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: false,
        length: 20
    })
    size: string

    @Column({
        type: 'varchar',
        nullable: false,
        length: 5,
        unique: true
    })
    symbol: string
}

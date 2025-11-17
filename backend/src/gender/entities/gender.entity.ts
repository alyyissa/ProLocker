import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => Product, (product) => product.gender)
    product: Product[]
}

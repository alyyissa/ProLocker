import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    
    @Column({
        unique: true,
        nullable: false
    })
    slug:string;

    
    @OneToMany(() => Product, (product) => product.color)
    product: Product[]
}

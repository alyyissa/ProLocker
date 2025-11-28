import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100
    })
    category: string

    @Column({
        unique: true,
        nullable: false
    })
    slug:string;

    @Column({
    type: 'text',
    nullable: true,
    })
    mainImage: string;

    @OneToMany(() => Product, (product) => product.category)
    product: Product[]
}

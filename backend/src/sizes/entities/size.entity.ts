import { ProductVarient } from "src/product-varient/entities/product-varient.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => ProductVarient, (productVarient) => productVarient.size)
    productVarients: ProductVarient[];
}

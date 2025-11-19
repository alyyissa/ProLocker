import { OrderItem } from "src/order-items/entities/order-item.entity";
import { Product } from "src/products/entities/product.entity";
import { Size } from "src/sizes/entities/size.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductVarient {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.varients)
    product: Product;

    @ManyToOne(() => Size)
    size: Size;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.productVarient)
    orderItems: OrderItem[];

    @Column({ type: 'int', default: 0 })
    quantity: number;
}

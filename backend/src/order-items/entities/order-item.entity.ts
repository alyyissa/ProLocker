import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Order, (order) => order.orderItems)
    order: Order

    @ManyToOne(() => Product, (product) => product.orderItems)
    product: Product

    @Column({
        type: 'int',
        nullable: false,
    })
    quantity: number;

    @Column({
        type: 'int',
        nullable: false,
    })
    totalPrice: number;
}

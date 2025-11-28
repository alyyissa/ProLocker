import { Order } from "src/orders/entities/order.entity";
import { ProductVarient } from "src/product-varient/entities/product-varient.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
    order: Order

    @ManyToOne(() => ProductVarient, (product) => product.orderItems, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'productVarientId' })
    productVarient: ProductVarient

    @Column({
        type: 'int',
        nullable: false,
    })
    quantity: number;

    @Column({
        type: 'int',
        nullable: false,
    })
    unitPrice: number;

    @Column({
        type: 'int',
        nullable: false,
    })
    totalPrice: number;
}

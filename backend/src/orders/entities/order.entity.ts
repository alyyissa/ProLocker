import { OrderItem } from "src/order-items/entities/order-item.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/orders.status.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    })
    phoneNumber: string;

    @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    })
    address?: string;

    @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
    })
    status: string;

    @ManyToOne(() => User, (user) => user.orders)
    user: User

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true, onDelete: 'CASCADE' })
    orderItems: OrderItem[]

    @CreateDateColumn()
    createdAt: Date;
}

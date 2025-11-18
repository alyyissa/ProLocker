import { OrderItem } from "src/order-items/entities/order-item.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    address: string;

    @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    })
    status: string;

    

    @ManyToOne(() => User, (user) => user.order)
    user: User

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[]
}

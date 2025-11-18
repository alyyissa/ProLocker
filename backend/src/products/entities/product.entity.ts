import { Category } from "src/categories/entities/category.entity";
import { Color } from "src/colors/entities/color.entity";
import { Gender } from "src/gender/entities/gender.entity";
import { OrderItem } from "src/order-items/entities/order-item.entity";
import { Order } from "src/orders/entities/order.entity";
import { Size } from "src/sizes/entities/size.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
        })
    name: string;

    @Column({
        type: 'int',
        nullable: false,
    })
    price: number

    @Column({
        type: "boolean",
        default: true
    })
    isAvailable: boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Color, (color) => color.product, {eager: true})
    color: Color

    @ManyToOne(() => Category, (category) => category.product, {eager: true})
    category: Category

    @ManyToOne(() => Gender, (gender) => gender.product, {eager: true})
    gender: Gender

    @ManyToOne(() => Size, (size) => size.product, {eager: true})
    size: Size

    @OneToMany(() => OrderItem, (item) => item.product)
    orderItems: OrderItem[];
}

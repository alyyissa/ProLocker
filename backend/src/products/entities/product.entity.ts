import { Category } from "src/categories/entities/category.entity";
import { Color } from "src/colors/entities/color.entity";
import { Gender } from "src/gender/entities/gender.entity";
import { OrderItem } from "src/order-items/entities/order-item.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductStatus } from "../enums/product-status.enum";
import { ProductVarient } from "src/product-varient/entities/product-varient.entity";

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

    @Column({ type: 'int', default: 0})
    quantity: number;

    @Column({
        unique: true,
        nullable: false
    })
    slug:string;

    @Column({ type: 'int', default: 0 })
    sale: number;

    @Column({   
                type: 'enum',
                enum: ProductStatus,
                default: ProductStatus.Available
            })
    status: string;

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

    @BeforeInsert()
    @BeforeUpdate()
    updateStatus() {
        if (this.quantity === 0) {
            this.status = 'Out of Stock';
        } else if (this.quantity < 3) {
            this.status = 'Few Left';
        } else {
            this.status = 'Available';
        }
    }

    @OneToMany(() => ProductVarient, (varient) => varient.product, {cascade: true})
    varients: ProductVarient[];

    @Column({
    type: 'simple-array',
    nullable: true,
    })
    galleryImages: string[];

    @Column({
    type: 'text',
    nullable: true,
    })
    mainImage: string;
}

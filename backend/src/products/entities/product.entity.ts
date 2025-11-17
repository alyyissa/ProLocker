import { Category } from "src/categories/entities/category.entity";
import { Color } from "src/colors/entities/color.entity";
import { Gender } from "src/gender/entities/gender.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Color, (color) => color.product)
    color: Color

    @ManyToOne(() => Category, (category) => category.product)
    category: Category

    @ManyToOne(() => Gender, (gender) => gender.product)
    gender: Gender
}

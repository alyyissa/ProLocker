import { Category } from "src/categories/entities/category.entity";
import { Color } from "src/colors/entities/color.entity";
import { Gender } from "src/gender/entities/gender.entity";
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
    
    @Column({default: true})
    isActive: boolean;

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

    @OneToMany(() => ProductVarient, (varient) => varient.product, {eager: true, cascade: true})
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

    @Column({
        type: 'int',
        nullable: false,
        default: 0,
    })
    priceAfterSale: number;

    @BeforeInsert()
    @BeforeUpdate()
    updatePriceAfterSale(){
        if(this.sale && this.sale>0){
            const discountAmount = (this.price * this.sale) / 100;
            this.priceAfterSale = Math.round(this.price - discountAmount)
        }else{
            this.priceAfterSale = this.price
        }
    }
}

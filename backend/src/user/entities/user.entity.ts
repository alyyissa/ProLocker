import { Order } from "src/orders/entities/order.entity";
import { Permission } from "src/permission/entity/permission.entity";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100
    })
    firstName: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100
    })
    lastName: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100,
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100
    })
    password: string;
    
    @CreateDateColumn()
    CreatedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]

    @OneToMany(() => Permission, (perm) => perm.user)
    permissions: Permission[]
}

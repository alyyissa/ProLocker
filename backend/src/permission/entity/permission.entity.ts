import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Permission{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.permissions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User

    @Column()
    userId: number;
}
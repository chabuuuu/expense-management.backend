import { CategoryType } from "@/enums/category-type.enum";
import { Budget } from "@/models/budget.model";
import { User } from "@/models/user.model";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Index(["name", "user_id", "type"], {unique: true})
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", {length: 20})
    name!: string;

    @Column("text", {nullable: true})
    picture?: string;

    @Column({
        type: "enum",
        enum: CategoryType,
        default: CategoryType.EXPENSE,
    })
    type!: string;

    @Column()
    user_id!: string;

    //FKs:
    @ManyToOne(() => User, user => user.categories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id'})
    user!: User;

    @OneToMany(()=> Budget, budget => budget.category)
    budgets!: Budget[];
}   
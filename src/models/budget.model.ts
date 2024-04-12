import { Category } from "@/models/category.model";
import { Wallet } from "@/models/wallet.model";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Budget {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    category_id!: string;

    @Column()
    wallet_id!: string;

    @Column("decimal", {precision: 30, scale: 0})
    amount!: number;

    //FKs:
    @ManyToOne(()=> Category, category => category.budgets, {
        onDelete: 'SET NULL'
    })
    category!: Category;

    @ManyToOne(()=> Wallet, wallet => wallet.budgets, {
        onDelete: 'CASCADE'
    })
    wallet!: Wallet;
}
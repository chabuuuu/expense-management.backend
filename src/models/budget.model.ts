import { Category } from "@/models/category.model";
import { Wallet } from "@/models/wallet.model";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({nullable: true})
    cron?: string;

    @Column({nullable: true})
    cron_start?: Date;

    @CreateDateColumn()
    create_at!: Date;

    //FKs:
    @ManyToOne(()=> Category, category => category.budgets, {
        onDelete: 'CASCADE',
    })
    category!: Category;

    // @ManyToOne(()=> Wallet, wallet => wallet.budgets, {
    //     onDelete: 'CASCADE'
    // })
    // wallet!: Wallet;
}
import { CurrencyUnit } from "@/enums/currency-unit.enum";
import { Transactions } from "@/models/transactions.model";
import { User_wallet } from "@/models/user_wallet.model";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Wallet{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("decimal", {precision: 30, scale: 0})
    amount!: number;

    @Column({
        type: "enum",
        enum: CurrencyUnit,
        default: CurrencyUnit.VND,
    })
    currency_unit!: string;

    @CreateDateColumn()
    create_at!: Date;

    @UpdateDateColumn()
    update_at!: Date;

    //FKs:
    @OneToMany(() => User_wallet, user_wallet => user_wallet.wallet, {
        onDelete: 'CASCADE'
    })
    user_wallets!: User_wallet[];

    @OneToMany(() => Transactions, transactions => transactions.wallet, {
        onDelete: 'CASCADE'
    })
    transactions!: Transactions[];
}
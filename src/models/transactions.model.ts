import { CurrencyUnit } from "@/enums/currency-unit.enum";
import { TransactionType } from "@/enums/transaction-type.enum";
import { User } from "@/models/user.model";
import { Wallet } from "@/models/wallet.model";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transactions {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    user_id!: string

    @Column("decimal", {precision: 30, scale: 0})
    amount!: number;

    @Column()
    category_id!: string;

    @Column()
    wallet_id!: string;

    @Column("text", {nullable: true})
    notes?: string;

    @Column("text", {nullable: true})
    picture?: string;

    @CreateDateColumn()
    transaction_date!: Date;

    @Column({
        type: "enum",
        enum: TransactionType,
        default: TransactionType.EXPENSE,
    })
    transaction_type!: string;

    @Column({
        type: "enum",
        enum: CurrencyUnit,
        default: CurrencyUnit.VND,
    })
    currency_unit!: string;

    @Column({nullable: true})
    target_wallet_id?: string;

    //FKs:
    @ManyToOne(() => Wallet, wallet => wallet.transactions)
    @JoinColumn({name: 'wallet_id'})
    wallet!: Wallet;

    @ManyToOne(() => User, user => user.transactions)
    @JoinColumn({name: 'user_id'})
    user!: User;    

    @ManyToOne(()=> Wallet, wallet => wallet.transactions_transafer_in, {
        onDelete: 'SET NULL'
    })
    @JoinColumn({name: 'target_wallet_id'})
    target_wallet!: Wallet;
}
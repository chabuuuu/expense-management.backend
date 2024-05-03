import { CurrencyUnit } from "@/enums/currency-unit.enum";
import { Budget } from "@/models/budget.model";
import { Transactions } from "@/models/transactions.model";
import { User_wallet } from "@/models/user_wallet.model";
import moment from "moment-timezone";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Wallet{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({default: "Default wallet"})
    name!: string;

    @Column("decimal", {precision: 30, scale: 0, default: 0})
    amount!: number;

    @Column({
        type: "enum",
        enum: CurrencyUnit,
        default: CurrencyUnit.VND,
    })
    currency_unit!: string;

    @CreateDateColumn({
        transformer: {
            to: (value: Date) => value,
            from: (value: string) => {
                const raw = moment(value)
                const vn = raw.clone().tz('Asia/Ho_Chi_Minh');
                return vn.format("YYYY-MM-DD HH:mm:ss");
            }
        }
    })
    create_at!: Date;

    @UpdateDateColumn({
        transformer: {
            to: (value: Date) => value,
            from: (value: string) => {
                const raw = moment(value)
                const vn = raw.clone().tz('Asia/Ho_Chi_Minh');
                return vn.format("YYYY-MM-DD HH:mm:ss");
            }
        }
    })
    update_at!: Date;

    //FKs:
    @OneToMany(() => User_wallet, user_wallet => user_wallet.wallet, {
        onDelete: 'CASCADE'
    })
    user_wallets!: User_wallet[];

    @OneToMany(() => Transactions, transactions => transactions.wallet)
    transactions!: Transactions[];

    @OneToMany(() => Transactions, transactions => transactions.wallet)
    transactions_transafer_in!: Transactions[];

    // @OneToMany(()=> Budget, budget => budget.wallet)
    // budgets!: Budget[];
}
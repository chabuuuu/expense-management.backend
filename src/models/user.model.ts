import { CurrencyUnit } from "@/enums/currency-unit.enum";
import { Budget } from "@/models/budget.model";
import { Category } from "@/models/category.model";
import { Transactions } from "@/models/transactions.model";
import { User_wallet } from "@/models/user_wallet.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", { length: 20, unique: true})
    username!: string;

    @Column("varchar", { length: 15, unique: true})
    phone_number!: string;

    // @Column("varchar", { length: 50, unique: true})
    // email!: string;

    @Column("varchar", { length: 100})
    password!: string;

    @Column("text", {nullable: true})
    deviceToken?: string;

    // @Column("varchar", { length: 30})
    // full_name!: string;

    // @Column({default: false})
    // phone_number_verified!: boolean;

    @Column({
        type: "enum",
        enum: CurrencyUnit,
        default: CurrencyUnit.VND,
    })
    currency_unit!: string;

    //FKs:
    @OneToMany(() => User_wallet, user_wallet => user_wallet.user)
    user_wallets!: User_wallet[];

    @OneToMany(() => Transactions, transactions => transactions.user)
    transactions!: Transactions[];

    @OneToMany(()=> Category, category => category.user)
    categories!: Category[];

    @OneToMany(()=> Budget, budget => budget.user)
    budgets!: Budget[];
}
import { CurrencyUnit } from "@/enums/currency-unit.enum";
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

    @Column("varchar", { length: 50, unique: true})
    email!: string;

    @Column("varchar", { length: 100})
    password!: string;

    @Column("varchar", { length: 30})
    full_name!: string;

    @Column({default: false})
    email_verified!: boolean;

    @Column({
        type: "enum",
        enum: CurrencyUnit,
        default: CurrencyUnit.VND,
    })
    currency_unit!: string;

    //FKs:
    @OneToMany(() => User_wallet, user_wallet => user_wallet.user, {
        onDelete: 'CASCADE'
    })
    user_wallets!: User_wallet[];
}
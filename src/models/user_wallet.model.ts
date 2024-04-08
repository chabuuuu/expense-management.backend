import { User } from "@/models/user.mode";
import { Wallet } from "@/models/wallet.model";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class User_wallet {
    @PrimaryColumn()
    user_id!: string;

    @PrimaryColumn()
    wallet_id!: string;

    @CreateDateColumn()
    join_date!: Date;

    @Column({default: false})
    isAdmin!: boolean;

    //FKs:
    @ManyToOne(() => User, user => user.user_wallets)
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Wallet, wallet => wallet.user_wallets, {
        eager: true
    })
    @JoinColumn({name: 'wallet_id'})
    wallet!: Wallet;
}
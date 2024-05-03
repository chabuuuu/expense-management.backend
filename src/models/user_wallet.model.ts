import { User } from "@/models/user.model";
import { Wallet } from "@/models/wallet.model";
import moment from "moment-timezone";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class User_wallet {
    @PrimaryColumn()
    user_id!: string;

    @PrimaryColumn()
    wallet_id!: string;

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
    join_date!: Date;

    @Column({default: true})
    isAdmin!: boolean;

    //FKs:
    @ManyToOne(() => User, user => user.user_wallets, {
        onDelete: 'CASCADE',
        cascade: true
    })
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Wallet, wallet => wallet.user_wallets, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'wallet_id'})
    wallet!: Wallet;
}
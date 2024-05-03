import { CurrencyUnit } from "@/enums/currency-unit.enum";
import { Category } from "@/models/category.model";
import { User } from "@/models/user.model";
import { Wallet } from "@/models/wallet.model";
import moment from "moment-timezone";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Budget {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    category_id!: string;

    // @Column()
    // wallet_id!: string;

    @Column("decimal", {precision: 30, scale: 0})
    limit_amount!: number;

    @Column("decimal", {precision: 30, scale: 0, default: 0})
    expensed_amount!: number;


    @Column({
        type: "enum",
        enum: CurrencyUnit,
        default: CurrencyUnit.VND,
    })
    currency_unit!: string;
    
    @Column({nullable: true})
    cron?: string;

    @Column({nullable: true})
    cron_start?: Date;

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

    //FKs:
    @OneToOne(()=> Category, category => category.budget, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'category_id'})
    category!: Category;


    @Column()
    user_id!: string;

    //FKs:
    @ManyToOne(() => User, user => user.budgets, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'user_id'})
    user!: User;

    // @ManyToOne(()=> Wallet, wallet => wallet.budgets, {
    //     onDelete: 'CASCADE'
    // })
    // wallet!: Wallet;
}
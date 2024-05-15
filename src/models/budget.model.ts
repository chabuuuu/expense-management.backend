import { BudgetNoRenewUnit } from "@/enums/budget-no-renew-unit.enum";
import { BudgetRenewUnit } from "@/enums/budget-renew-unit.enum";
import { BudgetType } from "@/enums/budget-type.enum";
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
    
    /*
    Nếu là NO_RENEW thì:
    - no_renew_date_unit: WEEK/MONTH/YEAR
    - no_renew_date: ví dụ, là WEEK thì sẽ là "13/05/2024-19/05/2024"
    
    Nếu là RENEW thì:
    - renew_date_unit: WEEK/MONTH/YEAR
    - custom_renew_date: ngày/tháng/năm
    */
    
    @Column({type: "enum", enum: BudgetType, default: BudgetType.NO_RENEW})
    budget_type!: string;


    //NO RENEW
    @Column(
        {
            type: "enum",
            enum: BudgetNoRenewUnit,
            nullable: true
        }
    )
    no_renew_date_unit?: string;


    @Column({nullable: true})
    no_renew_date?: string;


    //RENEW
    @Column(
        {
            type: "enum",
            enum: BudgetRenewUnit,
            nullable: true
        }
    )
    renew_date_unit?: string;


    @Column({nullable: true,         
        transformer: {
        to: (value: Date) => value,
        from: (value: string) => {
            const raw = moment(value)
            const vn = raw.clone().tz('Asia/Ho_Chi_Minh');
            return vn.format("YYYY-MM-DD HH:mm:ss");
        }
    }})

    //Sẽ có giá trị khi ewnew_date_unit là CUSTOM
    custom_renew_date?: Date;

    //Budget hiện tại có đang active hay không
    @Column({default: true})
    is_active!: boolean;

    @Column({default: false})
    enable_notification!: boolean;


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
    @ManyToOne(()=> Category, category => category.budgets, {
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

}
import { Account } from "@/models/account.model";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id! : string 

    @Index({unique: true})
    @Column("varchar", {length: 30})
    name! : string

    @OneToMany(() => Account, account => account.role)
    accounts!: Account[]
}
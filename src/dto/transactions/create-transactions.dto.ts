import { CurrencyUnit } from "@/enums/currency-unit.enum";
import { TransactionType } from "@/enums/transaction-type.enum";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionsDto{
    user_id?: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    amount!: number;

    @IsOptional()
    @IsString()
    category_id!: string;

    @IsNotEmpty()
    @IsString()
    wallet_id!: string;

    @IsOptional()
    notes?: string | undefined;

    @IsOptional()
    picture?: string | undefined;

    @IsOptional()
    transaction_date?: Date | undefined;

    @IsOptional()
    @IsEnum(TransactionType)
    transaction_type!: string;

    @IsOptional()
    @IsEnum(CurrencyUnit)
    currency_unit!: string;

    @IsOptional()
    target_wallet_id?: string | undefined;
}
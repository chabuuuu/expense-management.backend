import { TransactionType } from "@/enums/transaction-type.enum";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class findTransactionsFilterDto {
    @IsOptional()
    @IsString()
    wallet_id?: string;

    @IsOptional()
    @IsEnum(TransactionType)
    transaction_type?: string;

    @IsOptional()
    @IsString()
    category_id?: string;
}
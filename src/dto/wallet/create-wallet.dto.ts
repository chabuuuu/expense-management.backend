import { CurrencyUnit } from "@/enums/currency-unit.enum";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateWalletDto {
    @IsOptional()
    name!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    amount!: number;

    @IsOptional()
    @IsEnum(CurrencyUnit)
    currency_unit!: string;
}
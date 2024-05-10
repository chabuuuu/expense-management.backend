import { BudgetRenewUnit } from "@/enums/budget-renew-unit.enum";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsEnum, IsDateString } from "class-validator";

export class CreateRenewBudgetDto {
    @IsNotEmpty()
    @IsString()
    category_id!: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    limit_amount!: number;


    @IsNotEmpty()
    @IsEnum(BudgetRenewUnit)
    renew_date_unit!: string;

    @IsOptional()
    @IsDateString()
    custom_renew_date!: Date;

    user_id?: string;
}
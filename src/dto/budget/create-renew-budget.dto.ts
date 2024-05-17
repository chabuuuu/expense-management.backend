import { BudgetRenewUnit } from "@/enums/budget-renew-unit.enum";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsEnum, IsDateString, IsBooleanString, IsBoolean } from "class-validator";

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

    @IsNotEmpty()
    @IsBoolean()
    enable_notification!: boolean;

    user_id?: string;
    budget_type?: string;
}
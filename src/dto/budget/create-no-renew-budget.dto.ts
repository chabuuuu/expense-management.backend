import { BudgetNoRenewUnit } from "@/enums/budget-no-renew-unit.enum";
import { BudgetType } from "@/enums/budget-type.enum";
import { CronType } from "@/enums/cron-type.enum";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsEnum, IsDateString, IsBooleanString, IsBoolean } from "class-validator";

export class CreateNoRenewBudgetDto {
    @IsNotEmpty()
    @IsString()
    category_id!: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    limit_amount!: number;


    @IsNotEmpty()
    @IsEnum(BudgetNoRenewUnit)
    no_renew_date_unit?: string;

    @IsNotEmpty()
    @IsString()
    no_renew_date!: string;

    @IsNotEmpty()
    @IsBoolean()
    enable_notification!: boolean;

    user_id?: string;

    is_active?: boolean;


}
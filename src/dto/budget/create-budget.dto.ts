import { CronType } from "@/enums/cron-type.enum";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBudgetDto {
    @IsNotEmpty()
    @IsString()
    category_id!: string;

    @IsNotEmpty()
    @IsString()
    wallet_id!: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    amount!: number;

    @IsOptional()
    @IsEnum(CronType)
    cron?: string | undefined;

    @IsOptional()
    @IsDateString()
    cron_custom?: Date;
}
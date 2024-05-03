import { CronType } from "@/enums/cron-type.enum";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateBudgetDto {
    @IsOptional()
    @IsString()
    category_id!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    limit_amount!: number;

    @IsOptional()
    @IsEnum(CronType)
    cron?: string | undefined;

    @IsOptional()
    @IsDateString()
    cron_start?: Date;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    expensed_amount!: number;
}
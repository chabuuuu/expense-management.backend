import { CronType } from "@/enums/cron-type.enum";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateBudgetDto {
    @IsNotEmpty()
    @IsString()
    category_id!: string;

    @IsNotEmpty()
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

    user_id?: string;
}
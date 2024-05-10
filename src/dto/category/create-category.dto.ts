import { CategoryType } from "@/enums/category-type.enum";
import { Budget } from "@/models/budget.model";
import { User } from "@/models/user.model";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto  {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    name!: string;

    @IsOptional()
    @IsString()
    picture?: string;

    @IsNotEmpty()
    @IsEnum(CategoryType)
    type!: string;

    // @IsNotEmpty()
    // @IsString()
    user_id?: string;
}
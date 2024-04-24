import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class UserModifyDto {
    @IsOptional()
    @IsString()
    username!: string;

    @IsOptional()
    @IsString()
    password!: string;
}
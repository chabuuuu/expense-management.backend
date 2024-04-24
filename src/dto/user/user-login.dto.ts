import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
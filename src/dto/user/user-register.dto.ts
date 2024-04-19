import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class UserRegisterDto{
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
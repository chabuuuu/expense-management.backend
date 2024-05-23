import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class ResetPasswordDto {

    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number!: string;

    @IsNotEmpty()
    @IsString()
    new_password!: string;

    @IsNotEmpty()
    @IsString()
    otp_code!: string;
}
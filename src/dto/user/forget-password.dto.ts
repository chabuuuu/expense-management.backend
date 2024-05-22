import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {

    @IsNotEmpty()
    @IsString()
    new_password!: string;

    @IsNotEmpty()
    @IsString()
    otp_code!: string;
}
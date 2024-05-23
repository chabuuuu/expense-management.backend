import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class ForgetPasswordDtp {
    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number!: string;
}
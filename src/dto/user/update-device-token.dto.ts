import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDeviceTokenDto {
    @IsNotEmpty()
    @IsString()
    deviceToken!: string;
}
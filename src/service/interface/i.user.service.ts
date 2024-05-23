import { ResetPasswordDto } from "@/dto/user/reset-password.dto";
import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { IBaseService } from "@/service/interface/i.base.service";

export interface IUserService<T> extends IBaseService<T>{
    forgetPassword(phone_number: string): Promise<any>
    register(data: UserRegisterDto): Promise<any>
    verifyPhoneNumber(data: {phone_number: string, verify_token: string}): Promise<any>
    login(phone_number: string, password: string): Promise<any>
    changePassword(userId: string, data: {old_password: string, new_password: string}): Promise<any>
    updateDeviceToken(userId: string, deviceToken: string): Promise<any>
    resetPasswordCallBack(data: ResetPasswordDto) : Promise< any >
}
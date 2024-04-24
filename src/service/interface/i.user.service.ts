import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { IBaseService } from "@/service/interface/i.base.service";

export interface IUserService<T> extends IBaseService<T>{
    register(data: UserRegisterDto): Promise<any>
    verifyPhoneNumber(data: {phone_number: string, verify_token: string}): Promise<any>
    login(phone_number: string, password: string): Promise<any>
}
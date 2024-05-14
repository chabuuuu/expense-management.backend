import { IBaseController } from "@/controller/interface/i.base.controller";

export interface IUserController<T> extends IBaseController<T>{
    login(req: any, res: any, next: any) : Promise<any>
    register(req: any, res: any, next: any) : Promise<any>
    verifyPhoneNumber(req: any, res: any, next: any) : Promise<any>
    getProfile(req: any, res: any, next: any) : Promise<any>
    changePhoneNumer(req: any, res: any, next: any) : Promise<any>
    changePassword(req: any, res: any, next: any) : Promise<any>
    updateDeviceToken(req: any, res: any, next: any) : Promise<any>
}
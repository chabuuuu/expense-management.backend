import { IBaseController } from "@/controller/interface/i.base.controller";

export interface IUserController<T> extends IBaseController<T>{
    login(req: any, res: any, next: any) : Promise<any>
    register(req: any, res: any, next: any) : Promise<any>
}
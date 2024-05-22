import { IBaseRepository } from "@/repository/interface/i.base.repository";

export interface IUserRepository<T> extends IBaseRepository<T>{
    updateDeviceToken(userId: string, deviceToken: string): Promise<any>
    getDetail(userId: string): Promise<any>
}
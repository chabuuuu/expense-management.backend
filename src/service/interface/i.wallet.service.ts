import { IBaseService } from "@/service/interface/i.base.service";

export interface IWalletService<T> extends IBaseService<T>{
    createWalletForUser(userId: string, data: any): Promise<any>
}
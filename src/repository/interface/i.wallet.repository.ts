import { IBaseRepository } from "@/repository/interface/i.base.repository";

export interface IWalletRepository<T> extends IBaseRepository<T>{
    _createWalletForUser(userId: string, data: any): Promise<any>
}
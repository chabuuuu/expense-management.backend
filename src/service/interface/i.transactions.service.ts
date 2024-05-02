import { IBaseService } from "@/service/interface/i.base.service";

export interface ITransactionsService<T> extends IBaseService<T> {
    createMyTransactions(data: any): Promise<any>;
}
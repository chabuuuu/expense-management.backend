import { IBaseController } from "@/controller/interface/i.base.controller";

export interface ITransactionsController<T> extends IBaseController<T> {
  findAllMyTransactions(req: any, res: any, next: any): Promise<any>;
  createMyTransactions(req: any, res: any, next: any): Promise<any>;
}

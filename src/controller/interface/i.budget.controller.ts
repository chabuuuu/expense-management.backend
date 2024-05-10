import { IBaseController } from "@/controller/interface/i.base.controller";

export interface IBudgetController <T> extends IBaseController<T>{
    createNoRenewBudget(req: any, res: any, next: any): Promise<any>;
    createRenewBudget(req: any, res: any, next: any): Promise<any>;
    findAllBudgetOfMe(req: any, res: any, next: any): Promise<any>;
    resetExpensedAmount(req: any, res: any, next: any): Promise<any>
}
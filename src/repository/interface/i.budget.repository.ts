import { IBaseRepository } from "@/repository/interface/i.base.repository";

export interface IBudgetRepository<T> extends IBaseRepository<T>{
    refreshBudgetRenewDate(id: string, date: Date): Promise<any>;
    refreshBudgetAmount(id: string): Promise<any>;
    disableBudget(budgetId: string): Promise<any>;
    enableBudget(budgetId: string): Promise<any>;
}
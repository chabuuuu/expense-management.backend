import { IBaseRepository } from "@/repository/interface/i.base.repository";

export interface IBudgetRepository<T> extends IBaseRepository<T>{
    disableBudget(budgetId: string): Promise<any>;
    enableBudget(budgetId: string): Promise<any>;
}
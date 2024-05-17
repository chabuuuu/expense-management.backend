import { Budget } from "@/models/budget.model";

export interface IWorkerService {
    init() : any;
    cronCheckExpiredBugets(cron: number) : any;
    cronCheckStartedBudgets(cron: number): Promise<any>;
    cronCheckAlmostExpiredBugets(cron: number): any;
    cronRefreshBudgetAmount(cron: number): Promise<any>;
    disableNoRenewBudget(budget: Budget) : Promise<boolean>;
    isAlmostExpired(budget: Budget): Promise<boolean>;
    activeNoReNewBudget(budget: Budget): Promise<any>;
}
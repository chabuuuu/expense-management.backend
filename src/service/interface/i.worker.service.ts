import { Budget } from "@/models/budget.model";

export interface IWorkerService {
    init() : any;
    cronCheckExpiredBugets() : any;
    cronCheckAlmostExpiredBugets() : any;
    disableNoRenewBudget(budget: Budget) : Promise<boolean>
}
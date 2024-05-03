import { IBudgetRepository } from "@/repository/interface/i.budget.repository";
import { BaseService } from "@/service/base/base.service";
import { IBudgetService } from "@/service/interface/i.budget.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class BudgetService extends BaseService implements IBudgetService<any>{
    private budgetRepository: IBudgetRepository<any>;
    constructor(@inject(ITYPES.Repository) repository: IBudgetRepository<any>) {
        super(repository);
        this.budgetRepository = repository;
    }
}
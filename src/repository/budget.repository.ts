import { Budget } from "@/models/budget.model";
import { BaseRepository } from "@/repository/base/base.repository";
import { IBudgetRepository } from "@/repository/interface/i.budget.repository";
import { ITYPES } from "@/types/interface.types";
import { inject } from "inversify";
import { DataSource } from "typeorm";

export class BudgetRepository extends BaseRepository<Budget> implements IBudgetRepository<Budget>{
    constructor(@inject(ITYPES.Datasource) dataSource : DataSource){
        super(dataSource.getRepository(Budget))
    }

    async disableBudget(budgetId: string): Promise<any> {
        return await this._update({
            where: { id: budgetId },
            data: { is_active: false }
        });
    }

    async enableBudget(budgetId: string): Promise<any> {
        return await this._update({
            where: { id: budgetId },
            data: { is_active: true }
        });
    }
}
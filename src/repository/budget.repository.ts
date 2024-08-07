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
    async refreshBudgetRenewDate(id: string, date: Date | null): Promise<any> {        
        return await this._update({
            where: { id: id },
            data: {
                custom_renew_date: date
            }
        })
    }

    //Refresh budget amount
    async refreshBudgetAmount(id: string): Promise<any> {
        const budget = await this._findOne({ where: { id: id } });
        if (!budget) {
            throw new Error("Budget not found");
        }

        return await this._update({
            where: { id: id },
            data: {
                expensed_amount: 0
            }
        })
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
import { BaseController } from "@/controller/base/base.controller";
import { IBudgetController } from "@/controller/interface/i.budget.controller";
import { CreateBudgetDto } from "@/dto/budget/create-budget.dto";
import { CronType } from "@/enums/cron-type.enum";
import { IBudgetService } from "@/service/interface/i.budget.service";
import { ITYPES } from "@/types/interface.types";
import { convertToCron } from "@/utils/cron/text-to-cron-convert.util";
import { inject, injectable } from "inversify";

@injectable()
export class BudgetController extends BaseController implements IBudgetController<any>{
    private budgetService: IBudgetService<any>;
    constructor(
        @inject(ITYPES.Service) service: IBudgetService<any>
    ) {
        super(service)
        this.budgetService = service;
    }
    async create(req: any, res: any, next: any): Promise<any> {
        try {
            if (!req.body) throw new Error("Data is required");
            let data : CreateBudgetDto = req.body;
            if (data.cron){
                console.log('date: ', data.cron_custom);
                
                data.cron = convertToCron(data.cron, data.cron_custom);
            }
            console.log(data.cron);
            return;
            const result = await this.service.create({data});
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
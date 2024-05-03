import { BaseController } from "@/controller/base/base.controller";
import { IBudgetController } from "@/controller/interface/i.budget.controller";
import { CreateBudgetDto } from "@/dto/budget/create-budget.dto";
import { UpdateBudgetDto } from "@/dto/budget/update-budget.dto";
import { CronType } from "@/enums/cron-type.enum";
import { IBudgetService } from "@/service/interface/i.budget.service";
import { ITYPES } from "@/types/interface.types";
import { convertToCron } from "@/utils/cron/text-to-cron-convert.util";
import BaseError from "@/utils/error/base.error";
import { inject, injectable } from "inversify";

@injectable()
export class BudgetController
  extends BaseController
  implements IBudgetController<any>
{
  private budgetService: IBudgetService<any>;
  constructor(@inject(ITYPES.Service) service: IBudgetService<any>) {
    super(service);
    this.budgetService = service;
  }
  async create(req: any, res: any, next: any): Promise<any> {
    try {
      if (!req.body) throw new Error("Data is required");
      let data: CreateBudgetDto = req.body;
      const category_id = data.category_id;
      const user_id = req.user.id;
      data.user_id = user_id;
      if (await this.budgetService.exists({ where: { category_id } })) {
        throw new BaseError(
          400,
          "fail",
          "Budget already exists on this category. Please delete it first"
        );
      }
      if (data.cron) {
        if (data.cron === CronType.Custom) {
          if (!data.cron_start)
            throw new BaseError(400, "fail", "Cron start date is required");
        }
      }
      console.log(data.cron);
      const result = await this.service.create({ data });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async findAllBudgetOfMe(req: any, res: any, next: any): Promise<any> {
    try {
      const user_id = req.user.id;
      if (!user_id) {
        throw new BaseError(404, "fail", "User not found!");
      }
      const result = await this.service.findAll({
        where: {
          user_id: user_id,
        },
        relations: {
          category: true,
        },
        select: {
          category: true,
        },
      });
      res.json({
        rows: result,
        total: result.length,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req: any, res: any, next: any): Promise<any> {
    try {
      if (!req.params.id) throw new Error("Id is required");
      if (!req.body) throw new Error("Update data is required");
      const data: UpdateBudgetDto = req.body;
      const id = req.params.id;
      if (data.cron) {
        if (data.cron === CronType.Custom) {
          if (!data.cron_start)
            throw new BaseError(400, "fail", "Cron start date is required");
        }
      }
      if (data.limit_amount && !data.expensed_amount) {
        const beUpdateBudget = await this.service.findOne({
          where: { id: id },
        });
        if (beUpdateBudget.expensed_amount > data.limit_amount) {
          throw new BaseError(
            400,
            "fail",
            "Limit amount must be greater than expensed amount"
          );
        }
      }
      if (data.expensed_amount && !data.limit_amount) {
        const beUpdateBudget = await this.service.findOne({
          where: { id: id },
        });
        if (beUpdateBudget.limit_amount < data.expensed_amount) {
          throw new BaseError(
            400,
            "fail",
            "Expensed amount must be less than limit amount"
          );
        }
      }
      if (data.expensed_amount && data.limit_amount) {
        if (data.expensed_amount > data.limit_amount) {
          throw new BaseError(
            400,
            "fail",
            "Expensed amount must be less than limit amount"
          );
        }
      }
      const result = await this.service.update({ where: { id: id }, data });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetExpensedAmount(req: any, res: any, next: any): Promise<any> {
    try {
      if (!req.params.id) throw new Error("Id is required");
      const id = req.params.id;
      const result = await this.service.update({ where: { id: id }, data: {
        expensed_amount: 0
      } });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

import { BaseController } from "@/controller/base/base.controller";
import { ITransactionsController } from "@/controller/interface/i.transactions.controller";
import { CreateTransactionsDto } from "@/dto/transactions/create-transactions.dto";
import { findTransactionsFilterDto } from "@/dto/transactions/find-transactions-filter.dto";
import { User } from "@/models/user.model";
import { ITransactionsService } from "@/service/interface/i.transactions.service";
import { ITYPES } from "@/types/interface.types";
import { classValidateUtil } from "@/utils/class-validate/class-validate.util";
import BaseError from "@/utils/error/base.error";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import moment from "moment";

@injectable()
export class TransactionsController
  extends BaseController
  implements ITransactionsController<any>
{
  private transactionService: ITransactionsService<any>;
  constructor(@inject(ITYPES.Service) service: ITransactionsService<any>) {
    super(service);
    this.transactionService = service;
  }
  async findAllMyTransactions(req: any, res: any, next: any): Promise<any> {
    try {
      const user: User = req.user;
      if (!user) {
        throw new BaseError(StatusCodes.NOT_FOUND, "fail", "User not found!");
      }
      const userId = user.id;
      const query: findTransactionsFilterDto = await classValidateUtil(
        findTransactionsFilterDto,
        req.query
      );
      console.log('query', query);

      const filter = {
        user_id: userId,
        wallet_id: query.wallet_id,
        transaction_type: query.transaction_type,
        category_id: query.category_id
      }
      console.log('filter', filter);
      
      
      const result = await this.transactionService.findAll({
        where: filter,
        select: {
          wallet: {
            name: true,
            amount: true,
            currency_unit: true
          },
          category: {
            name: true,
            picture: true,
            type: true
          }
        },
        relations: {
          wallet: true,
          category: true,
        }
      });
      res.json({
        rows: result,
        total: result.length,
      });
    } catch (error) {
      next(error);
    }
  }
  async createMyTransactions(req: any, res: any, next: any): Promise<any> {
    try {
      if (!req.body) throw new Error("Data is required");
      const user: User = req.user;
      if (!user) {
        throw new BaseError(StatusCodes.NOT_FOUND, "fail", "User not found!");
      }
      const userId = user.id;
      const data: CreateTransactionsDto = req.body;
      data.user_id = userId;
      if (data.transaction_date){
        if (moment(data.transaction_date).isAfter(moment())){
          throw new BaseError(StatusCodes.BAD_REQUEST, "fail", "Transaction date must not be in future!");
        }
      }
      console.log('data', data);
      
      const result = await this.transactionService.createMyTransactions({ data });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

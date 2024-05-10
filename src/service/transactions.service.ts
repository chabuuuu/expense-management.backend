import { CreateTransactionsDto } from "@/dto/transactions/create-transactions.dto";
import { TransactionType } from "@/enums/transaction-type.enum";
import { Budget } from "@/models/budget.model";
import { Category } from "@/models/category.model";
import { Transactions } from "@/models/transactions.model";
import { Wallet } from "@/models/wallet.model";
import { ITransactionsRepository } from "@/repository/interface/i.transactions.repository";
import { BaseService } from "@/service/base/base.service";
import { IBudgetService } from "@/service/interface/i.budget.service";
import { ICategoryService } from "@/service/interface/i.category.service";
import { ITransactionsService } from "@/service/interface/i.transactions.service";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { ITYPES } from "@/types/interface.types";
import { SERVICE_TYPES } from "@/types/service.types";
import BaseError from "@/utils/error/base.error";
import { inject, injectable } from "inversify";

@injectable()
export class TransactionsService
  extends BaseService
  implements ITransactionsService<any>
{
  private walletService: IWalletService<Wallet>;
  private transactionsRepository: ITransactionsRepository<Transactions>;
  private categoryService: ICategoryService<Category>;
  private budgetService: IBudgetService<Budget>;
  constructor(
    @inject(ITYPES.Repository) repository: ITransactionsRepository<any>,
    @inject(SERVICE_TYPES.Wallet) walletService: IWalletService<Wallet>,
    @inject(SERVICE_TYPES.Category) categoryService: ICategoryService<Category>,
    @inject(SERVICE_TYPES.Budget) budgetService: IBudgetService<Budget>
  ) {
    super(repository);
    this.walletService = walletService;
    this.transactionsRepository = repository;
    this.categoryService = categoryService;
    this.budgetService = budgetService;
  }
  async createMyTransactions(payload: any): Promise<any> {
    try {
      const data: CreateTransactionsDto = payload.data;
      const thisWallet = await this.walletService.findOne({
        where: { id: data.wallet_id },
      });
      let newWalletAmount = thisWallet.amount;
      const thisCategory = await this.categoryService.findOne({
        where: { id: data.category_id },
        relations: {
          budget: true,
        },
        select: {
          budget: true,
        }
      });
      //console.log("thisCategory", thisCategory);
      
      switch (data.transaction_type) {

        //Expense
        case TransactionType.EXPENSE:
          if (thisCategory.type !== TransactionType.EXPENSE) {
            throw new BaseError(400, "fail", "Category is not expense type");
          }
          const expenseAmount = Number(data.amount);
          if (thisWallet.amount < expenseAmount) {
            throw new BaseError(400, "fail", "Not enough money in wallet");
          }

//Fix lại phần này
          // if (thisCategory.budget) {
          //   const expensedBudget = Number(thisCategory.budget.expensed_amount);
          //   const limitBudget = Number(thisCategory.budget.limit_amount);
          //   if (expensedBudget + expenseAmount > limitBudget) {
          //     throw new BaseError(400, "fail", "Budget limit exceeded");
          //   }
          //   let newExpensedBudget = expensedBudget + expenseAmount;
          //   const budgetId = thisCategory.budget.id;
          //   await this.budgetService.update({
          //     where: { id: budgetId },
          //     data: { expensed_amount: newExpensedBudget  },
          //   });
          // }


          newWalletAmount = Number(thisWallet.amount) - Number(expenseAmount);
          await this.walletService.update({
            where: {id: thisWallet.id},
            data: { amount: newWalletAmount },
          });
          return await this.transactionsRepository._create({ data });
          break;

        //Income
        case TransactionType.INCOME:
          if (thisCategory.type !== TransactionType.INCOME) {
            throw new BaseError(400, "fail", "Category is not income type");
          }
          newWalletAmount = Number(thisWallet.amount) + Number(data.amount);
          console.log("newWalletAmount", newWalletAmount);
          
          await this.walletService.update({
            where: {id: thisWallet.id},
            data: { amount: newWalletAmount },
          });
          console.log("data", data);

          return await this.transactionsRepository._create({ data });
          break;

        //Transfer
        case TransactionType.TRANSFER:
          if (!data.target_wallet_id) {
            throw new BaseError(400, "fail", "Target wallet is required");
          }
          if (data.wallet_id === data.target_wallet_id) {
            throw new BaseError(
              400,
              "fail",
              "Cannot transfer to the same wallet"
            );
          }
          const targetWallet = await this.walletService.findOne({
            where: { id: data.target_wallet_id },
          });
          if (thisWallet.amount < data.amount) {
            throw new BaseError(400, "fail", "Not enough money in wallet");
          }
          newWalletAmount = Number(thisWallet.amount) - Number(data.amount);
          await this.walletService.update({
            where: {id: thisWallet.id},
            data: { amount: newWalletAmount },
          });
          const newTargetWalletAmount = Number(targetWallet.amount) + Number(data.amount);
          await this.walletService.update({
            where: {id: targetWallet.id},
            data: { amount: newTargetWalletAmount },
          });
          return await this.transactionsRepository._create(data);
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}

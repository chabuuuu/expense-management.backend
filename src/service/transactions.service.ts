import { CreateTransactionsDto } from "@/dto/transactions/create-transactions.dto";
import { TransactionType } from "@/enums/transaction-type.enum";
import { Category } from "@/models/category.model";
import { Transactions } from "@/models/transactions.model";
import { Wallet } from "@/models/wallet.model";
import { ITransactionsRepository } from "@/repository/interface/i.transactions.repository";
import { BaseService } from "@/service/base/base.service";
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
  constructor(
    @inject(ITYPES.Repository) repository: ITransactionsRepository<any>,
    @inject(SERVICE_TYPES.Wallet) walletService: IWalletService<Wallet>,
    @inject(SERVICE_TYPES.Category) categoryService: ICategoryService<Category>
  ) {
    super(repository);
    this.walletService = walletService;
    this.transactionsRepository = repository;
    this.categoryService = categoryService;
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
      });
      switch (data.transaction_type) {
        case TransactionType.EXPENSE:
          if (thisCategory.type !== TransactionType.EXPENSE) {
            throw new BaseError(400, "fail", "Category is not expense type");
          }
          const expenseAmount = Number(data.amount);
          if (thisWallet.amount < expenseAmount) {
            throw new BaseError(400, "fail", "Not enough money in wallet");
          }
          newWalletAmount = Number(thisWallet.amount) - Number(expenseAmount);
          await this.walletService.update({
            where: {id: thisWallet.id},
            data: { amount: newWalletAmount },
          });
          return await this.transactionsRepository._create({ data });
          break;
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

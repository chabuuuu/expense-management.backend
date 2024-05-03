import { budgetService } from "@/container/budget.container";
import { categoryService } from "@/container/category.container";
import { walletService } from "@/container/wallet.container";
import { ITransactionsController } from "@/controller/interface/i.transactions.controller";
import { TransactionsController } from "@/controller/transactions.controller";
import { AppDataSource } from "@/database/db.datasource";
import { Budget } from "@/models/budget.model";
import { Category } from "@/models/category.model";
import { Transactions } from "@/models/transactions.model";
import { Wallet } from "@/models/wallet.model";
import { ITransactionsRepository } from "@/repository/interface/i.transactions.repository";
import { TransactionsRepository } from "@/repository/transactions.repository";
import { IBudgetService } from "@/service/interface/i.budget.service";
import { ICategoryService } from "@/service/interface/i.category.service";
import { ITransactionsService } from "@/service/interface/i.transactions.service";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { TransactionsService } from "@/service/transactions.service";
import { ITYPES } from "@/types/interface.types";
import { SERVICE_TYPES } from "@/types/service.types";
import { Container } from "inversify";

const transactionContainer = new Container();

transactionContainer.bind<ITransactionsController<any>>(ITYPES.Controller).to(TransactionsController);
transactionContainer.bind<ITransactionsRepository<Transactions>>(ITYPES.Repository).to(TransactionsRepository);
transactionContainer.bind<ITransactionsService<any>>(ITYPES.Service).to(TransactionsService);
transactionContainer.bind(ITYPES.Datasource).toConstantValue(AppDataSource);

//Import service
transactionContainer.bind<IWalletService<Wallet>>(SERVICE_TYPES.Wallet).toConstantValue(walletService);
transactionContainer.bind<ICategoryService<Category>>(SERVICE_TYPES.Category).toConstantValue(categoryService);
transactionContainer.bind<IBudgetService<Budget>>(SERVICE_TYPES.Budget).toConstantValue(budgetService);

const transactionsController = transactionContainer.get<ITransactionsController<any>>(ITYPES.Controller);
const transactionsService = transactionContainer.get<ITransactionsService<any>>(ITYPES.Service);

export {transactionsController, transactionsService};
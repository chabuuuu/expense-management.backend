import { Container } from "inversify";
import { DataSource } from "typeorm";
import { AccountController } from "@/controller/account.controller";
import { AccountService } from "@/service/account.service";
import { ITYPES } from "@/types/interface.types";
import { Account } from "@/models/account.model";
import { AccountRepository } from "@/repository/account.repository";
import { AppDataSource } from "@/database/db.datasource";
import { IAccountService } from "@/service/interface/i.account.service";
import { IAccountRepository } from "@/repository/interface/i.account.repository";
import { IAccountController } from "@/controller/interface/i.account.controller";

const accountContainer = new Container();
accountContainer.bind<IAccountService<any>>(ITYPES.Service).to(AccountService);
accountContainer.bind<IAccountRepository<Account>>(ITYPES.Repository).to(AccountRepository);
accountContainer.bind<IAccountController<any>>(ITYPES.Controller).to(AccountController);
accountContainer.bind<DataSource>(ITYPES.Datasource).toConstantValue(AppDataSource);
const accountController = accountContainer.get<IAccountController<any>>(ITYPES.Controller);
const accountService = accountContainer.get<IAccountService<any>>(ITYPES.Service);

export {accountController, accountService}

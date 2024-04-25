import { BudgetController } from "@/controller/budget.controller";
import { IBudgetController } from "@/controller/interface/i.budget.controller";
import { AppDataSource } from "@/database/db.datasource";
import { Budget } from "@/models/budget.model";
import { BudgetRepository } from "@/repository/budget.repository";
import { IBudgetRepository } from "@/repository/interface/i.budget.repository";
import { BudgetService } from "@/service/budget.service";
import { IBudgetService } from "@/service/interface/i.budget.service";
import { ITYPES } from "@/types/interface.types";
import { Container } from "inversify";

const budgetContainer = new Container();

budgetContainer.bind<IBudgetService<any>>(ITYPES.Service).to(BudgetService);
budgetContainer.bind<IBudgetController<any>>(ITYPES.Controller).to(BudgetController);
budgetContainer.bind<IBudgetRepository<Budget>>(ITYPES.Repository).to(BudgetRepository);
budgetContainer.bind(ITYPES.Datasource).toConstantValue(AppDataSource);

const budgetController = budgetContainer.get<IBudgetController<any>>(ITYPES.Controller);
const budgetService = budgetContainer.get<IBudgetService<any>>(ITYPES.Service);

export {budgetController, budgetService}
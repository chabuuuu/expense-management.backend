import { OneHourInMs } from "@/constants/time.constant";
import { BudgetNoRenewUnit } from "@/enums/budget-no-renew-unit.enum";
import { BudgetType } from "@/enums/budget-type.enum";
import { Budget } from "@/models/budget.model";
import { IBudgetRepository } from "@/repository/interface/i.budget.repository";
import { INotificationService } from "@/service/interface/i.notification.service";
import { IWorkerService } from "@/service/interface/i.worker.service";
import { REPOSITORY_TYPES } from "@/types/repository.types";
import { SERVICE_TYPES } from "@/types/service.types";
import { inject, injectable } from "inversify";
import moment from "moment";

@injectable()
export class WorkerService implements IWorkerService {
  budgetRepository: IBudgetRepository<Budget>;
  notificationService: INotificationService;
  constructor(
    @inject(REPOSITORY_TYPES.Budget)
    budgetRepository: IBudgetRepository<Budget>,
    @inject(SERVICE_TYPES.Notification)
    notificationService: INotificationService
  ) {
    this.budgetRepository = budgetRepository;
    this.notificationService = notificationService;
  }

  async init() {
    // this.cronCheckExpiredBugets();
    // this.cronCheckAlmostExpiredBugets();
    // this.cronCheckStartedBudgets();
    console.log("Worker service is ready");
  }

  //Check expired budgets every hour and disable it + send notification
  async cronCheckExpiredBugets() {
    setInterval(async () => {
      //Step 1: Get all budgets
      const budgets: Budget[] = await this.budgetRepository._findAll({});

      //Step 2: Check if any budget is expired
      for (let budget of budgets) {
        const budget_type = budget.budget_type;

        //If the budget is renew type, skip
        if (budget_type === BudgetType.RENEW) {
          continue;
        }

        //Check budget is acive or not
        if (!budget.is_active) {
          continue;
        }

        //If the budget is no renew type, check if it is expired
        const isExpired = await this.disableNoRenewBudget(budget);
        if (isExpired) {
          console.log(`Budget ${budget.id} is expired`);
          //TODO: Send notification
          this.notificationService.sendNotificationToUser(
            budget.user_id,
            `Budget with id:${budget.id} for category: ${budget.category.budgets} is expired`
          );
        }
      }
    }, OneHourInMs);
  }

  //Check if the budget is started, use for no renew budget
  async cronCheckStartedBudgets(): Promise<any> {
    setInterval(async () => {
      //Step 1: Get all budgets
      const budgets: Budget[] = await this.budgetRepository._findAll({});

      //Step 2: Check if any budget is started
      for (let budget of budgets) {
        const budget_type = budget.budget_type;

        //If the budget is renew type, skip
        if (budget_type === BudgetType.RENEW) {
          continue;
        }

        //Check if budget is active or not
        if (budget.is_active) {
          continue;
        }

        //If the budget is no renew type, active it if it is started
        await this.activeNoReNewBudget(budget);
      }
    }, OneHourInMs);
  }

  //Check almost expired budgets every hour and send notification
  async cronCheckAlmostExpiredBugets() {
    setInterval(async () => {
      //Step 1: Get all budgets
      const budgets: Budget[] = await this.budgetRepository._findAll({});

      //Step 2: Check if any budget is almost expired
      for (let budget of budgets) {
        const budget_type = budget.budget_type;

        //If the budget is renew type, skip
        if (budget_type === BudgetType.RENEW) {
          continue;
        }

        //Check if budget is active or not
        if (!budget.is_active) {
          continue;
        }

        //If the budget is no renew type, check if it is almost expired
        const isAlmostExpired = await this.isAlmostExpired(budget);
        if (isAlmostExpired) {
          console.log(
            `Budget ${budget.id} will expire after ${almostExpireDays} days`
          );
          this.notificationService.sendNotificationToUser(
            budget.user_id,
            `Budget with id:${budget.id} for category: ${budget.category.budgets} will expire after ${almostExpireDays} days`
          );
          return;
        }
      }
    }, OneHourInMs);
  }

  async cronRefreshBudgetAmount(): Promise<any> {
    setInterval(async () => {
      //Step 1: Get all budgets
      const budgets: Budget[] = await this.budgetRepository._findAll({});

      //Step 2: Refresh budget amount
      for (let budget of budgets) {
        //If the budget is no renew type, skip
        if (budget.budget_type === BudgetType.NO_RENEW) {
          continue;
        }

        //Check if budget is active or not, if not, skip
        if (!budget.is_active) {
          continue;
        }

        //Refresh budget amount if in plan
        await this.budgetRepository.refreshBudgetAmount(budget.id);
      }
    }, OneHourInMs);
  }

  //Searching and disable budget if it is expired, return true if the budget is expired
  async disableNoRenewBudget(budget: Budget): Promise<boolean> {
    let expireDate;
    switch (budget.no_renew_date_unit) {
      case BudgetNoRenewUnit.DAY:
        expireDate = moment(budget.no_renew_date, "DD-MM-YYYY");
        if (moment().isAfter(expireDate)) {
          await this.budgetRepository.disableBudget(budget.id);
        }
        return true;
      case BudgetNoRenewUnit.MONTH:
        expireDate = moment(budget.no_renew_date, "MM-YYYY").endOf("month");
        if (moment().isAfter(expireDate)) {
          await this.budgetRepository.disableBudget(budget.id);
        }
        return true;
      case BudgetNoRenewUnit.YEAR:
        expireDate = moment(budget.no_renew_date, "YYYY").endOf("year");
        if (moment().isAfter(expireDate)) {
          await this.budgetRepository.disableBudget(budget.id);
        }
        return true;
      case BudgetNoRenewUnit.WEEK:
        let startDate = budget.no_renew_date!.split(" ")[0];
        let endDate = budget.no_renew_date!.split(" ")[1];
        let start = moment(startDate, "DD-MM-YYYY");
        let end = moment(endDate, "DD-MM-YYYY");
        if (moment().isBetween(start, end)) {
          await this.budgetRepository.disableBudget(budget.id);
        }
        return true;
      case BudgetNoRenewUnit.TIME_SPAN:
        let startDate_Timespan = budget.no_renew_date!.split(" ")[0];
        let endDate_Timespan = budget.no_renew_date!.split(" ")[1];
        let start_Timespan = moment(startDate_Timespan, "DD-MM-YYYY");
        let end_Timespan = moment(endDate_Timespan, "DD-MM-YYYY");
        if (moment().isBetween(start_Timespan, end_Timespan)) {
          await this.budgetRepository.disableBudget(budget.id);
        }
        return true;
    }
    return false;
  }

  async isAlmostExpired(budget: Budget): Promise<boolean> {
    let expireDate;
    switch (budget.no_renew_date_unit) {
      case BudgetNoRenewUnit.DAY:
        expireDate = moment(budget.no_renew_date, "DD-MM-YYYY");
        if (moment().add(almostExpireDays, "days").isAfter(expireDate)) {
          return true;
        }
        break;
      case BudgetNoRenewUnit.MONTH:
        expireDate = moment(budget.no_renew_date, "MM-YYYY").endOf("month");
        if (moment().add(almostExpireDays, "days").isAfter(expireDate)) {
          return true;
        }
        break;
      case BudgetNoRenewUnit.YEAR:
        expireDate = moment(budget.no_renew_date, "YYYY").endOf("year");
        if (moment().add(almostExpireDays, "days").isAfter(expireDate)) {
          return true;
        }
        break;
      case BudgetNoRenewUnit.WEEK:
        let endDate = budget.no_renew_date!.split(" ")[1];
        let end = moment(endDate, "DD-MM-YYYY");
        if (moment().add(almostExpireDays, "days").isAfter(end)) {
          return true;
        }
        break;
      case BudgetNoRenewUnit.TIME_SPAN:
        let endDate_Timespan = budget.no_renew_date!.split(" ")[1];
        let end_TimeSpan = moment(endDate_Timespan, "DD-MM-YYYY");
        if (moment().add(almostExpireDays, "days").isAfter(end_TimeSpan)) {
          return true;
        }
        break;
      default:
        break;
    }
    return false;
  }

  //Active no renew budget if it is started
  async activeNoReNewBudget(budget: Budget): Promise<any> {
    switch (budget.no_renew_date_unit) {
      case BudgetNoRenewUnit.TIME_SPAN:
        let startDate_Timespan = budget.no_renew_date!.split(" ")[0];
        let start_Timespan = moment(startDate_Timespan, "DD-MM-YYYY");
        if (moment().isAfter(start_Timespan)) {
          await this.budgetRepository.enableBudget(budget.id);
        }
        return;
      case BudgetNoRenewUnit.WEEK:
        let startDate = budget.no_renew_date!.split(" ")[0];
        let endDate = budget.no_renew_date!.split(" ")[1];
        let start = moment(startDate, "DD-MM-YYYY");
        let end = moment(endDate, "DD-MM-YYYY");
        if (moment().isAfter(start) && moment().isBefore(end)) {
          await this.budgetRepository.enableBudget(budget.id);
        }
        return;
    }
    return;
  }
}

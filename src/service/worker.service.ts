import { almostExpireDays } from "@/constants/almostExpireDays.constant";
import {
  FifteenMinutesInMs,
  FiveMinuteInMs,
  OneHourInMs,
  OneMinuteInMs,
} from "@/constants/time.constant";
import { BudgetNoRenewUnit } from "@/enums/budget-no-renew-unit.enum";
import { BudgetRenewUnit } from "@/enums/budget-renew-unit.enum";
import { BudgetType } from "@/enums/budget-type.enum";
import { Budget } from "@/models/budget.model";
import { IBudgetRepository } from "@/repository/interface/i.budget.repository";
import { INotificationService } from "@/service/interface/i.notification.service";
import { IWorkerService } from "@/service/interface/i.worker.service";
import { REPOSITORY_TYPES } from "@/types/repository.types";
import { SERVICE_TYPES } from "@/types/service.types";
import { log } from "console";
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
    this.cronCheckExpiredBugets(FifteenMinutesInMs);

    //Waiting for 1 minutes before start next cron job
    await new Promise(resolve => setTimeout(resolve, OneMinuteInMs));
    this.cronCheckAlmostExpiredBugets(FifteenMinutesInMs);
    console.log('Check almost expired budgets every hour started');
    
    //Waiting for 1 minutes before start next cron job
    await new Promise(resolve => setTimeout(resolve, OneMinuteInMs));
    this.cronCheckStartedBudgets(FifteenMinutesInMs);
    console.log('Check started budgets every hour started');
    
    //Waiting for 1 minutes before start next cron job
    await new Promise(resolve => setTimeout(resolve, OneMinuteInMs));
    this.cronRefreshBudgetAmount(FiveMinuteInMs);
    console.log('Refresh budget amount every minute started');

    console.log("Worker service is ready");
  }

  //Check expired budgets every hour and disable it + send notification
  async cronCheckExpiredBugets(cron: number) {
    setInterval(async () => {
      console.log("Checking expired budgets every hour");

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
          if (budget.enable_notification) {
            this.notificationService.sendNotificationToUser(
              budget.user_id,
              `Budget for category: ${budget.category.name} is expired`
            );
          }
        }
      }
    }, cron);
  }

  //Check if the budget is started, use for no renew budget
  async cronCheckStartedBudgets(cron: number): Promise<any> {
    setInterval(async () => {
      log("Checking started budgets every hour");
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
    }, cron);
  }

  //Check almost expired budgets every hour and send notification
  async cronCheckAlmostExpiredBugets(cron: number) {
    setInterval(async () => {
      console.log("Checking almost expired budgets every hour");

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
            `Budget for category ${budget.category.name} will expire after ${almostExpireDays} days`
          );

          //Send notification

          if (budget.enable_notification) {
            this.notificationService.sendNotificationToUser(
              budget.user_id,
              `Budget with id:${budget.id} for category: ${budget.category.name} will expire after ${almostExpireDays} days`
            );
          }

          return;
        }
      }
    }, cron);
  }

  async cronRefreshBudgetAmount(cron: number): Promise<any> {
    setInterval(async () => {
      console.log("Refreshing budget amount every minute");

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
        const expect_refresh_date = budget.custom_renew_date;

        console.log("Expect refresh date: ", expect_refresh_date);
        console.log(
          "is same or after: ",
          moment().isSameOrAfter(expect_refresh_date)
        );

        if (!expect_refresh_date) {
          continue;
        }

        //Nếu có custom_renew_date thì xét tới custom_renew_date
        //Tính toán ngày hết hạn mới dựa vào custom_renew_date và lưu vào custom_renew_date

        if (moment().isSameOrAfter(expect_refresh_date)) {
          await this.budgetRepository.refreshBudgetAmount(budget.id);
          switch (budget.renew_date_unit) {
            case BudgetRenewUnit.Daily:
              budget.custom_renew_date = moment().add(1, "days").toDate();
              await this.budgetRepository.refreshBudgetRenewDate(
                budget.id,
                budget.custom_renew_date
              );
              break;
            case BudgetRenewUnit.Monthly:
              budget.custom_renew_date = moment().add(1, "months").toDate();
              await this.budgetRepository.refreshBudgetRenewDate(
                budget.id,
                budget.custom_renew_date
              );
              break;
            case BudgetRenewUnit.Weekly:
              budget.custom_renew_date = moment().add(1, "weeks").toDate();
              await this.budgetRepository.refreshBudgetRenewDate(
                budget.id,
                budget.custom_renew_date
              );
              break;
            case BudgetRenewUnit.Yearly:
              budget.custom_renew_date = moment().add(1, "years").toDate();
              await this.budgetRepository.refreshBudgetRenewDate(
                budget.id,
                budget.custom_renew_date
              );
              break;
            case BudgetRenewUnit.Custom:
              await this.budgetRepository.refreshBudgetRenewDate(
                budget.id,
                null
              );
            default:
              break;
          }

          //Send notification
          if (budget.enable_notification) {
            this.notificationService.sendNotificationToUser(
              budget.user_id,
              `Budget for category: ${budget.category.name} is refreshed`
            );
          }
        }
      }
    }, cron);
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

          //Send notification
          if (budget.enable_notification) {
            this.notificationService.sendNotificationToUser(
              budget.user_id,
              `Budget for category: ${budget.category.name} is started`
            );
          }
        }
        return;
      case BudgetNoRenewUnit.WEEK:
        let startDate = budget.no_renew_date!.split(" ")[0];
        let endDate = budget.no_renew_date!.split(" ")[1];
        let start = moment(startDate, "DD-MM-YYYY");
        let end = moment(endDate, "DD-MM-YYYY");
        if (moment().isAfter(start) && moment().isBefore(end)) {
          await this.budgetRepository.enableBudget(budget.id);

          //Send notification
          if (budget.enable_notification) {
            this.notificationService.sendNotificationToUser(
              budget.user_id,
              `Budget for category: ${budget.category.name} is started`
            );
          }
        }
        return;
    }
    return;
  }
}

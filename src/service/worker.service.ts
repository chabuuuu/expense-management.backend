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
        @inject(REPOSITORY_TYPES.Budget) budgetRepository: IBudgetRepository<Budget>,
        @inject(SERVICE_TYPES.Notification) notificationService: INotificationService,
    ){
        this.budgetRepository = budgetRepository;
        this.notificationService = notificationService;
    }

    async init(){
        this.cronCheckExpiredBugets();
        console.log('Worker service is ready');
    }

    //Searching and disable budget if it is expired, return true if the budget is expired
    async disableNoRenewBudget(budget: Budget) : Promise<boolean> {
        let expireDate;
        switch (budget.no_renew_date_unit){
            case BudgetNoRenewUnit.DAY:
                 expireDate = moment(budget.no_renew_date, "DD-MM-YYYY");
                if (moment().isAfter(expireDate)){
                    await this.budgetRepository.disableBudget(budget.id);
                }
                return true;
            case BudgetNoRenewUnit.MONTH:
                 expireDate = moment(budget.no_renew_date, "MM-YYYY").endOf('month');
                if (moment().isAfter(expireDate)){
                    await this.budgetRepository.disableBudget(budget.id);
                }
                return true;
            case BudgetNoRenewUnit.YEAR:
                 expireDate = moment(budget.no_renew_date, "YYYY").endOf('year');
                if (moment().isAfter(expireDate)){
                    await this.budgetRepository.disableBudget(budget.id);
                }
                return true;
            case BudgetNoRenewUnit.WEEK:
                let startDate = budget.no_renew_date!.split(" ")[0];
                let endDate = budget.no_renew_date!.split(" ")[1];
                let start = moment(startDate, "DD-MM-YYYY");
                let end = moment(endDate, "DD-MM-YYYY");
                if (moment().isBetween(start, end)){
                    await this.budgetRepository.disableBudget(budget.id);
                }
                return true;
        }
        return false;
    }

    //Check expired budgets every hour and disable it + send notification
    async cronCheckExpiredBugets() {
        setInterval(async () => {

            this.notificationService.sendNotificationToUser('213', 'hello world');
            return;

            //Step 1: Get all budgets
            const budgets : Budget[] = await this.budgetRepository._findAll({});

            //Step 2: Check if any budget is expired
            for (let budget of budgets) {
                const budget_type = budget.budget_type;

                //If the budget is renew type, skip
                if (budget_type === BudgetType.RENEW) {
                    continue;
                }

                //If the budget is no renew type, check if it is expired
                const isExpired = await this.disableNoRenewBudget(budget);
                if (isExpired){
                    console.log(`Budget ${budget.id} is expired`);
                    //TODO: Send notification
                    this.notificationService.sendNotificationToUser(budget.user_id, `Budget with id:${budget.id} for category: ${budget.category.budgets} is expired`);
                }
            }
            

        }, 10000)
    }

    //Check almost expired budgets every hour and send notification
    async cronCheckAlmostExpiredBugets() {
        return;
    }
}
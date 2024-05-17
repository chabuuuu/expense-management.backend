import { budgetRepository } from "@/container/budget.container";
import { notificationService } from "@/container/notification.container";
import { Budget } from "@/models/budget.model";
import { IBudgetRepository } from "@/repository/interface/i.budget.repository";
import { INotificationService } from "@/service/interface/i.notification.service";
import { IWorkerService } from "@/service/interface/i.worker.service";
import { WorkerService } from "@/service/worker.service";
import { ITYPES } from "@/types/interface.types";
import { REPOSITORY_TYPES } from "@/types/repository.types";
import { SERVICE_TYPES } from "@/types/service.types";
import { Container } from "inversify";

const workerContainer = new Container();

workerContainer.bind<IWorkerService>(ITYPES.Service).to(WorkerService);

//Import
workerContainer.bind<IBudgetRepository<Budget>>(REPOSITORY_TYPES.Budget).toConstantValue(budgetRepository);
workerContainer.bind<INotificationService>(SERVICE_TYPES.Notification).toConstantValue(notificationService);

const workerService = workerContainer.get<IWorkerService>(ITYPES.Service);

export { workerService }
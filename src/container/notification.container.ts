import { userRepository } from "@/container/user.container";
import { INotificationController } from "@/controller/interface/i.notification.controller";
import { NotificationController } from "@/controller/notification.controller";
import { IUserRepository } from "@/repository/interface/i.user.repository";
import { INotificationService } from "@/service/interface/i.notification.service";
import { NotificationService } from "@/service/notification.service";
import { ITYPES } from "@/types/interface.types";
import { REPOSITORY_TYPES } from "@/types/repository.types";
import { Container } from "inversify";

const notificationContainer = new Container();

notificationContainer.bind<INotificationService>(ITYPES.Service).to(NotificationService);
notificationContainer.bind<INotificationController>(ITYPES.Controller).to(NotificationController);

//Import
notificationContainer.bind<IUserRepository<any>>(REPOSITORY_TYPES.User).toConstantValue(userRepository);

const notificationService = notificationContainer.get<INotificationService>(ITYPES.Service);
const notificationController = notificationContainer.get<INotificationController>(ITYPES.Controller);

export { notificationService, notificationController }
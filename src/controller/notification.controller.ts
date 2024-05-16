import { INotificationController } from "@/controller/interface/i.notification.controller";
import { INotificationService } from "@/service/interface/i.notification.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class NotificationController implements INotificationController{
    notifiationService: INotificationService;
    constructor(
        @inject(ITYPES.Service) notificationService : INotificationService
    ){
        this.notifiationService = notificationService;
    }

    async getNotificationList(req: any, res: any, next: any): Promise<any>{
        try {
            const userId = req.user.id;
            if (!userId) {
                throw new Error("User id not found");
            }
            const notificationList = await this.notifiationService.getNotificationList(userId);
            res.json(notificationList);
        } catch (error) {
            next(error);
        }
    }
}
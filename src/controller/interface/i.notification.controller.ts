export interface INotificationController {
    getNotificationList(req: any, res: any, next: any): Promise<any>;
    deleteNotification(req: any, res: any, next: any): Promise<any>;
}
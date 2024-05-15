import { Notification } from "firebase-admin/lib/messaging/messaging-api";

export interface INotificationService {
    sendNotificationToUser(userId: string, message: string): Promise<any>;
    sendNotificationToDeviceToken(deviceToken: string, notification: Notification): Promise<any>
}
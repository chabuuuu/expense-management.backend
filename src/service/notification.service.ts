import { INotificationService } from "@/service/interface/i.notification.service";
import { Notification } from "firebase-admin/lib/messaging/messaging-api";
import { inject, injectable } from "inversify";
import { REPOSITORY_TYPES } from "@/types/repository.types";
import { IUserRepository } from "@/repository/interface/i.user.repository";
import { User } from "@/models/user.model";
import firebaseInstance from "@/utils/firebase/firebase.instance";
import redis from "@/utils/redis/redis.instance.util";
import { RedisSchema } from "@/utils/redis/schema.enum";
import moment from "moment";
import { SevenDaysInSec } from "@/constants/time.constant";


@injectable()
export class NotificationService implements INotificationService{
    private userRepository: IUserRepository<User>;
    constructor(
        @inject(REPOSITORY_TYPES.User) userRepository : IUserRepository<User>
    ){
        this.userRepository = userRepository;
    }
    async deleteNotification(notificationId: string): Promise<any> {
        await redis.del(notificationId);
        return;
    }
    async getNotificationList(userId: string): Promise<any> {
        const notifications = await redis.keys(`${RedisSchema.notification}::${userId}?*`);
        const notificationList = await Promise.all(notifications.map(async (key) => {
            let value : any = await redis.get(key);
            value = JSON.parse(value)
            value.id = key;
            return value;
        }));
        const sortedNotificationList = 
        notificationList.sort((a, b) => 
            Number(moment(b.date, "DD-MM-YYYY HH:mm:ss").unix()) - Number(moment(a.date, "DD-MM-YYYY HH:mm:ss").unix())); //Sort by date
        return sortedNotificationList;
    }

    //Firebase function to send notification to mobile device
    async sendNotificationToDeviceToken(deviceToken: string, notification: Notification): Promise<any> {     
        
          firebaseInstance.messaging().send({
            token: deviceToken,
            notification: notification,
          });
    }

    //Send notification to user
    async sendNotificationToUser(userId: string, message: string): Promise<any> {
        const user = await this.userRepository._findOne({ where: { id: userId } });
        if(!user){
            throw new Error("User not found");
        }
        const deviceToken = user.deviceToken;
        if (!deviceToken) {
            console.log(`User ${userId} has no device token`);
            return;
            
        }
        const notification: Notification = {
            title: "Notification",
            body: message,
            imageUrl: "https://happay.com/blog/wp-content/uploads/sites/12/2022/08/what-is-expense-management.png"
        }
        this.sendNotificationToDeviceToken(deviceToken!, notification);
        console.log(`Notification sent to user ${userId} successfully`);
        const now = moment().format("DD-MM-YYYY HH:mm:ss");
        redis.set(`${RedisSchema.notification}::${userId}?time=${now}`, JSON.stringify({notification, date: now}), "EX", SevenDaysInSec);
    }
}
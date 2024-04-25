import BaseError from "@/utils/error/base.error";
import moment from "moment";

export function convertDateToCron (date: any) : string {
    try {
        const newDate = moment(date);
        console.log('newDate: ', newDate);
        

        const minutes = newDate.minute();
        const hours = newDate.hour();
        const days = newDate.day();
        const months = newDate.month() + 1;
        const dayOfWeek = newDate.day();
    
        return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
    } catch (error) {
        throw new BaseError(400, 'fail', 'Invalid Date Format');
    }
};
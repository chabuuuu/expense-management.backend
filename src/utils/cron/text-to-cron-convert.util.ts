import { CronType } from "@/enums/cron-type.enum";
import { convertDateToCron } from "@/utils/cron/date-to-cron-convert.util";
import BaseError from "@/utils/error/base.error";
import { StatusCodes } from "http-status-codes";

export function convertToCron(data: string, custom?: any){
    try {
        switch(data){
            case CronType.Daily:
                return "0 0 * * *";
            case CronType.Weekly:
                return "0 0 * * 0";
            case CronType.Monthly:
                return "0 0 1 * *";
            case CronType.Yearly:
                return "0 0 1 1 *";
            case CronType.Custom:
                if (!custom) throw new BaseError(StatusCodes.BAD_REQUEST, 'fail', "Custom Date is required");
                return convertDateToCron(custom);
            default:
                return "0 0 * * *";
        }
    } catch (error) {
        throw error;
    }

}
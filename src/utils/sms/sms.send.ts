import BaseError from "@/utils/error/base.error";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
const sms_api = process.env.SMS_API || 'https://api.sms.com';
const sms_username = process.env.SMS_USERNAME || 'none';
const sms_password = process.env.SMS_PASSWORD || 'none';

export async function sendSms(content: string, phoneNumbers: Array<string>) : Promise<any>{        
        const send_payload = JSON.stringify({
            message: content,
            phoneNumbers: phoneNumbers
        })
        const {data} = await axios.post(`${sms_api}`, send_payload, {
            headers: {
                "Content-Type": "application/json",
            },
            auth:{
                username: sms_username,
                password: sms_password
            }
        });
        console.log(data);
}
import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { IUserRepository } from "@/repository/interface/i.user.repository";
import { BaseService } from "@/service/base/base.service";
import { IUserService } from "@/service/interface/i.user.service";
import { ITYPES } from "@/types/interface.types";
import BaseError from "@/utils/error/base.error";
import { generateRandomString } from "@/utils/random/ramdom.generate";
import redis from "@/utils/redis/redis.instance.util";
import { RedisSchema } from "@/utils/redis/schema.enum";
import { sendSms } from "@/utils/sms/sms.send";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";

export class UserService extends BaseService implements IUserService<any> {
  constructor(@inject(ITYPES.Repository) repository: IUserRepository<any>) {
    super(repository);
  }
  async verifyPhoneNumber(data: { phone_number: string; verify_token: string; }): Promise<any> {
    try {
      const { phone_number, verify_token } = data;
      console.log(phone_number, verify_token);
      
      const nonActiveUser = await redis.get(`${RedisSchema.noneActiveUserData}::${phone_number}`);
      if (!nonActiveUser) {
        throw new BaseError(
          StatusCodes.BAD_REQUEST,
          "fail",
          "Cant not verify phone number. Please send otp again!"
        );
      }
      const nonActiveUserObj = JSON.parse(nonActiveUser);
      if (nonActiveUserObj.verify_token !== verify_token) {
        throw new BaseError(
          StatusCodes.BAD_REQUEST,
          "fail",
          "Invalid verification code"
        );
      }
      delete nonActiveUserObj.verify_token;
      const newUserInstance = plainToInstance(UserRegisterDto, nonActiveUserObj);
      const validateErrors = await validate(newUserInstance, { validationError: { target: false, value: false } })
      if (validateErrors.length > 0) {
        const formatError = validateErrors.map((error: any) => (
            Object.values(error.constraints).join(', ')
        ))            
        throw new BaseError(400, 'fail', formatError)
      }
      console.log(newUserInstance);
      
      const result = await this.repository._create({data: newUserInstance});
      redis.del(`${RedisSchema.noneActiveUserData}::${phone_number}`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(data: UserRegisterDto): Promise<any> {
    try {
      if (
        await this.repository._exists({
          where: { phone_number: data.phone_number },
        })
      )
        throw new BaseError(
          StatusCodes.BAD_REQUEST,
          "fail",
          "Phone number already exists"
        );
      if (await redis.get(`${RedisSchema.noneActiveUserData}::${data.phone_number}`)){
        throw new BaseError(
          StatusCodes.BAD_REQUEST,
          "fail",
          "Verification code has been sent to your phone number. Please wait for 5 minutes before sending again"
        );
      }
      const randomToken = await generateRandomString();
      const fiveMinuteInSeconds = 60 * 5;
      let nonActiveUser : any = data;
      nonActiveUser.verify_token = randomToken;
      redis.set(
        `${RedisSchema.noneActiveUserData}::${nonActiveUser.phone_number}`,
        JSON.stringify(nonActiveUser),
        "EX",
        fiveMinuteInSeconds
      );
      sendSms(`Hello from expense management!\nYour verification code is ${randomToken}`,
        [data.phone_number]
      );
      return {
        message: "OTP sent! Waiting for verify phone number",
      }
    } catch (error: any) {
      throw error
    }
  }
}

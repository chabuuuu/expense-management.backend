import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { Wallet } from "@/models/wallet.model";
import { IUserRepository } from "@/repository/interface/i.user.repository";
import { BaseService } from "@/service/base/base.service";
import { IUserService } from "@/service/interface/i.user.service";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { ITYPES } from "@/types/interface.types";
import { SERVICE_TYPES } from "@/types/service.types";
import BaseError from "@/utils/error/base.error";
import { generateRandomString } from "@/utils/random/ramdom.generate";
import redis from "@/utils/redis/redis.instance.util";
import { RedisSchema } from "@/utils/redis/schema.enum";
import { sendSms } from "@/utils/sms/sms.send";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
const jwt = require("jsonwebtoken");

export class UserService extends BaseService implements IUserService<any> {
  private walletService: IWalletService<any>;
  constructor(@inject(ITYPES.Repository) repository: IUserRepository<any>, 
    @inject(SERVICE_TYPES.Wallet) walletService: IWalletService<any>
) {
    super(repository);
    this.walletService = walletService;
  }
  async changePassword(userId: string, data: {
    old_password: string; new_password: string;
  }): Promise<any> {
    const { old_password, new_password } = data;
    const user = await this.repository._findOne({ where: { id: userId } });
    if (!user) {
      throw new BaseError(StatusCodes.BAD_REQUEST, "fail", "User not found");
    }    
    if (user.password !== old_password) {
      throw new BaseError(StatusCodes.BAD_REQUEST, "fail", "Old password is incorrect");
    }
    return this.repository._update({
      where: { id: userId },
      data: { password: new_password },
    });
  }
  async login(phone_number: string, password: string): Promise<any> {
    try {
      const user = await this.repository._findOne({
        where: { phone_number: phone_number },
      });
      if (!user)
        throw new BaseError(
          StatusCodes.BAD_REQUEST,
          "fail",
          "User not found"
        );
      if (user.password !== password) {
        throw new BaseError(
          StatusCodes.BAD_REQUEST,
          "fail",
          "Password is incorrect"
        );
      }
      const token = jwt.sign(
        {
          id: user.id,
          phone_number: user.phone_number,
          password: user.password,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      delete user.password;
      return {
        status: "suscess",
        user: user,
        token: "Bearer " + token,
      } as any;
    } catch (error) {
      throw error;
    }
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
      
      await this.walletService.createWalletForUser(result.id, {data: null});

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

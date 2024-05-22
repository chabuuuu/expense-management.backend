import { BaseController } from "@/controller/base/base.controller";
import { IUserController } from "@/controller/interface/i.user.controller";
import { ChangePasswordDto } from "@/dto/user/change-password.dto";
import { ResetPasswordDto } from "@/dto/user/forget-password.dto";
import { UpdateDeviceTokenDto } from "@/dto/user/update-device-token.dto";
import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { IUserService } from "@/service/interface/i.user.service";
import { ITYPES } from "@/types/interface.types";
import BaseError from "@/utils/error/base.error";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";

export class UserController
  extends BaseController
  implements IUserController<any>
{
  private userService: IUserService<any>;
  constructor(@inject(ITYPES.Service) service: IUserService<any>) {
    super(service);
    this.userService = service;
  }

  //Reset password with otp and new password
  async resetPassword(req: any, res: any, next: any): Promise<any> {
    try {
      const data : ResetPasswordDto = req.body;
      const user_id = req.user.id;
      const result = await this.userService.resetPasswordCallBack(data, user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  //Send otp to phone number
  async forgetPassword(req: any, res: any, next: any): Promise<any> {
    try {
      const user = req.user;
      const result = await this.userService.forgetPassword(user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async changePhoneNumer(req: any, res: any, next: any): Promise<any> {
    try {
    } catch (error) {
      next(error);
    }
  }
  async changePassword(req: any, res: any, next: any): Promise<any> {
    try{
      const user = req.user;
      const data : ChangePasswordDto = req.body;
      const result = await this.service.changePassword(user.id, data);
      res.json(result);
    }catch(error){
      next(error)
    }
  }
  async update(req: any, res: any, next: any): Promise<any> {
    try {
      if (!req.body) throw new Error("Update data is required");
      const user = req.user;
      const data = req.body;
      if (data.hasOwnProperty("username")) {
        const existsUsername = await this.service.findOne({
          where: { username: data.username },
        });
        if (existsUsername) {
          throw new BaseError(
            StatusCodes.BAD_REQUEST,
            "fail",
            "Username is exists"
          );
        }
      }
      const result = await this.service.update({
        where: { id: user.id },
        data,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async getProfile(req: any, res: any, next: any): Promise<any> {
    try {
      const result = await this.service.findOne({
        where: { id: req.user.id },
        relations: ["user_wallets", "transactions", "categories", "budgets"],
        order: {
          transactions: {
            transaction_date: "DESC",
          },
          user_wallets: {
            join_date: "DESC",
          }
        }
      });
      console.log('result', typeof result.transactions[0].transaction_date);
      
      if (!result) {
        throw new BaseError(StatusCodes.NOT_FOUND, "fail", "User not found");
      }
      if (result.hasOwnProperty("password")) {
        delete result.password;
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async verifyPhoneNumber(req: any, res: any, next: any): Promise<any> {
    try {
      let { phone_number, verify_token } = req.query;
      if (!phone_number || !verify_token) {
        throw new BaseError(
          StatusCodes.BAD_REQUEST,
          "fail",
          "Phone number and verify token is required"
        );
      }
      let format_phone_number = `+${phone_number}`;
      const result = await this.userService.verifyPhoneNumber({
        phone_number: format_phone_number,
        verify_token,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async login(req: any, res: any, next: any): Promise<any> {
    try {
      const phone_number = req.body.phone_number;
      const password = req.body.password;
      const result = await this.service.login(phone_number, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async register(req: any, res: any, next: any): Promise<any> {
    try {
      const data: UserRegisterDto = req.body;
      const result = await this.userService.register(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async updateDeviceToken(req: any, res: any, next: any): Promise<any> {
    try {
      const user = req.user;
      const data : UpdateDeviceTokenDto = req.body;
      const deviceToken = data.deviceToken;
      const result = await this.service.updateDeviceToken(user.id, deviceToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

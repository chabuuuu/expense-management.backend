import { BaseController } from "@/controller/base/base.controller";
import { IUserController } from "@/controller/interface/i.user.controller";
import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { IUserService } from "@/service/interface/i.user.service";
import { ITYPES } from "@/types/interface.types";
import BaseError from "@/utils/error/base.error";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";

export class UserController extends BaseController implements IUserController<any>{
    private userService: IUserService<any>;
    constructor(
        @inject(ITYPES.Service) service: IUserService<any>
    ) {
        super(service)
        this.userService = service;
    }
    async verifyPhoneNumber(req: any, res: any, next: any): Promise<any> {
        try {
            let {phone_number, verify_token} = req.query;
            if (!phone_number || !verify_token) {
                throw new BaseError(StatusCodes.BAD_REQUEST, 'fail', "Phone number and verify token is required")
            }
            let format_phone_number = `+${phone_number}`
            const result = await this.userService.verifyPhoneNumber({phone_number: format_phone_number, verify_token});
            res.json(result);
        } catch (error) {
            next(error);
        }

    }
    async login(req: any, res: any, next: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async register(req: any, res: any, next: any): Promise<any> {
        try {
            const data : UserRegisterDto = req.body;
            const result = await this.userService.register(data);
            res.json(result);
        } catch (error) {
          next(error);  
        }
    }
}
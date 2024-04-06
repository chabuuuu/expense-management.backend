import { inject, injectable } from "inversify";
import { BaseController } from "@/controller/base/base.controller";
import { IAccountController } from "@/controller/interface/i.account.controller";
import { ITYPES } from "@/types/interface.types";
import { IAccountService } from "@/service/interface/i.account.service";

@injectable()
export class AccountController extends BaseController implements IAccountController<any>{
    constructor(
        @inject(ITYPES.Service) service: IAccountService<any>
    ) {
        super(service)
    }
}
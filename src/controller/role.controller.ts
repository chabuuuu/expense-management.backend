import { BaseController } from "@/controller/base/base.controller";
import { IRoleController } from "@/controller/interface/i.role.account.controller";
import { IRoleService } from "@/service/interface/i.role.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class RoleController extends BaseController implements IRoleController<any> {
    constructor(
        @inject(ITYPES.Service) service: IRoleService<any>
    ) {
        super(service)
    }
}
import { BaseController } from "@/controller/base/base.controller";
import { IBaseController } from "@/controller/interface/i.base.controller";
import { ICategoryService } from "@/service/interface/i.category.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class CategoryController extends BaseController implements IBaseController<any>{
    constructor(
        @inject(ITYPES.Service) service: ICategoryService<any>
    ) {
        super(service)
    }
}
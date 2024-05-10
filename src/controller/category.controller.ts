import { BaseController } from "@/controller/base/base.controller";
import { IBaseController } from "@/controller/interface/i.base.controller";
import { CreateCategoryDto } from "@/dto/category/create-category.dto";
import { ICategoryService } from "@/service/interface/i.category.service";
import { ITYPES } from "@/types/interface.types";
import BaseError from "@/utils/error/base.error";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
@injectable()
export class CategoryController extends BaseController implements IBaseController<any>{
    constructor(
        @inject(ITYPES.Service) service: ICategoryService<any>
    ) {
        super(service)
    }
    async create(req: any, res: any, next: any): Promise<any> {
        try {
            if (!req.body) throw new Error("Data is required");
            const data : CreateCategoryDto = req.body;
            const user_id = req.user.id;
            data.user_id = user_id;
            const result = await this.service.create({data});
            res.json(result);
        } catch (error: any) {
            if (error.errno === 1062){
                error = new BaseError(StatusCodes.BAD_REQUEST, 'fail', `Category type ${req.body.type} with this name already exists`);
            }
            next(error);
        }
    }
}
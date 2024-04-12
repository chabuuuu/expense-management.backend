import { ICategoryRepository } from "@/repository/interface/i.category.repository";
import { BaseService } from "@/service/base/base.service";
import { ICategoryService } from "@/service/interface/i.category.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class CategoryService extends BaseService implements ICategoryService<any>{
    constructor(@inject(ITYPES.Repository) repository: ICategoryRepository<any>) {
        super(repository);
    }
}
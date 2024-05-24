import { IBaseService } from "@/service/interface/i.base.service";

export interface ICategoryService <T> extends IBaseService<T> {
    createDefaultCategories(userId: string): Promise<any>
}
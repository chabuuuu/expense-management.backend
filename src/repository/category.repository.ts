import { Category } from "@/models/category.model";
import { BaseRepository } from "@/repository/base/base.repository";
import { ICategoryRepository } from "@/repository/interface/i.category.repository";
import { ITYPES } from "@/types/interface.types";
import { inject } from "inversify";
import { DataSource } from "typeorm";

export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository<Category>{
    constructor(@inject(ITYPES.Datasource) dataSource : DataSource){
        super(dataSource.getRepository(Category))
    }
}
import { IBaseService } from "@/service/interface/i.base.service";
import { injectable } from "inversify";
import "reflect-metadata";
@injectable()
export class BaseService implements IBaseService<any>{
    protected repository: any;
    public constructor(repository: any) {
        this.repository = repository;
    }
    async exists(params: { where: any; }): Promise<boolean> {
        return await this.repository._exists(params);
    }
    async create(data: any): Promise<any> {        
        return await this.repository._create(data);
    }
    async update(params: any): Promise<any> {
        return await this.repository._update(params);
    }
    async delete(params: any): Promise<any> {
        try {
            return await this.repository._delete(params);
        } catch (error) {
            throw error;
        }
    }
    async findOne(params: any): Promise<any> {
        return await this.repository._findOne(params);
    }
    async findAll(params: any): Promise<any> {
        return await this.repository._findAll(params);
    }
}
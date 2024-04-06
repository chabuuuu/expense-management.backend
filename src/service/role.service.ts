import { IRoleRepository } from "@/repository/interface/i.role.repository";
import { BaseService } from "@/service/base/base.service";
import { IRoleService } from "@/service/interface/i.role.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class RoleService extends BaseService implements IRoleService<any> {
    constructor(@inject(ITYPES.Repository) repository: IRoleRepository<any>) {
        super(repository);
    }
}
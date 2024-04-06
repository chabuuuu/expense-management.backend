import { IRoleController } from "@/controller/interface/i.role.account.controller";
import { RoleController } from "@/controller/role.controller";
import { AppDataSource } from "@/database/db.datasource";
import { Role } from "@/models/role.model";
import { IRoleRepository } from "@/repository/interface/i.role.repository";
import { RoleRepository } from "@/repository/role.repository";
import { IRoleService } from "@/service/interface/i.role.service";
import { RoleService } from "@/service/role.service";
import { ITYPES } from "@/types/interface.types";
import { Container } from "inversify";

const roleContainer = new Container();
roleContainer.bind<IRoleService<any>>(ITYPES.Service).to(RoleService)
roleContainer.bind<IRoleRepository<Role>>(ITYPES.Repository).to(RoleRepository)
roleContainer.bind<IRoleController<any>>(ITYPES.Controller).to(RoleController)
roleContainer.bind(ITYPES.Datasource).toConstantValue(AppDataSource)

const roleController = roleContainer.get<IRoleController<any>>(ITYPES.Controller)
const roleService = roleContainer.get<IRoleService<any>>(ITYPES.Service)

export {roleController, roleService}
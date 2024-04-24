import { walletService } from "@/container/wallet.container";
import { IUserController } from "@/controller/interface/i.user.controller";
import { UserController } from "@/controller/user.controller";
import { AppDataSource } from "@/database/db.datasource";
import { User } from "@/models/user.model";
import { IUserRepository } from "@/repository/interface/i.user.repository";
import { UserRepository } from "@/repository/user.repository";
import { IUserService } from "@/service/interface/i.user.service";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { UserService } from "@/service/user.service";
import { ITYPES } from "@/types/interface.types";
import { SERVICE_TYPES } from "@/types/service.types";
import { SERVFAIL } from "dns";
import { Container } from "inversify";

const userContainer = new Container();

userContainer.bind<IUserController<any>>(ITYPES.Controller).to(UserController);
userContainer.bind<IUserService<any>>(ITYPES.Service).to(UserService);
userContainer.bind<IUserRepository<User>>(ITYPES.Repository).to(UserRepository);
userContainer.bind(ITYPES.Datasource).toConstantValue(AppDataSource);

//Import service
userContainer.bind<IWalletService<any>>(SERVICE_TYPES.Wallet).toConstantValue(walletService);


const userController = userContainer.get<IUserController<any>>(ITYPES.Controller);
const userService = userContainer.get<IUserService<any>>(ITYPES.Service);

export { userController, userService };
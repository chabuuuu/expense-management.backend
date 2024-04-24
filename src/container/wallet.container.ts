import { IWalletController } from "@/controller/interface/i.wallet.controller";
import { WalletController } from "@/controller/wallet.controller";
import { AppDataSource } from "@/database/db.datasource";
import { Wallet } from "@/models/wallet.model";
import { IWalletRepository } from "@/repository/interface/i.wallet.repository";
import { WalletRepository } from "@/repository/wallet.repository";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { WalletService } from "@/service/wallet.service";
import { ITYPES } from "@/types/interface.types";
import { Container } from "inversify";

const walletContainer = new Container();

walletContainer.bind<IWalletService<any>>(ITYPES.Service).to(WalletService);
walletContainer.bind<IWalletRepository<Wallet>>(ITYPES.Repository).to(WalletRepository);
walletContainer.bind(ITYPES.Datasource).toConstantValue(AppDataSource);
walletContainer.bind<IWalletController<any>>(ITYPES.Controller).to(WalletController);

const walletService = walletContainer.get<IWalletService<any>>(ITYPES.Service);
const walletController = walletContainer.get<IWalletController<any>>(ITYPES.Controller);

export {walletController, walletService}
import { IWalletRepository } from "@/repository/interface/i.wallet.repository";
import { BaseService } from "@/service/base/base.service";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class WalletService extends BaseService implements IWalletService<any> {
    constructor(@inject(ITYPES.Repository) repository: IWalletRepository<any>) {
        super(repository);
    }
    async createWalletForUser(userId: string, data: any): Promise<any> {
        return await this.repository._createWalletForUser(userId, data)
    }
}
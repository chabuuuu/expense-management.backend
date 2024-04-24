import { User_wallet } from "@/models/user_wallet.model";
import { Wallet } from "@/models/wallet.model";
import { BaseRepository } from "@/repository/base/base.repository";
import { IWalletRepository } from "@/repository/interface/i.wallet.repository";
import { ITYPES } from "@/types/interface.types";
import { inject } from "inversify";
import { DataSource, Repository } from "typeorm";

export class WalletRepository extends BaseRepository<Wallet> implements IWalletRepository<Wallet> {
    private _walletRepository: Repository<Wallet>;
    private _userWalletRepository: Repository<User_wallet>;
    constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
        super(dataSource.getRepository(Wallet))
        this._walletRepository = dataSource.getRepository(Wallet)
        this._userWalletRepository = dataSource.getRepository(User_wallet)
    }
    async _createWalletForUser(userId: string, data: any): Promise<any> {
        try {
            const newWallet = await super._create(data)
            const userWallet = new User_wallet()
            userWallet.user_id = userId;
            userWallet.wallet_id = newWallet.id;
            await this._userWalletRepository.save(userWallet)
            return newWallet
        } catch (error) {
            throw error;
        }
    }
}
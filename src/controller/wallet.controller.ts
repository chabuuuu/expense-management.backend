import { BaseController } from "@/controller/base/base.controller";
import { IWalletController } from "@/controller/interface/i.wallet.controller";
import { IUserService } from "@/service/interface/i.user.service";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { ITYPES } from "@/types/interface.types";
import { SERVICE_TYPES } from "@/types/service.types";
import { inject } from "inversify";

export class WalletController extends BaseController implements IWalletController<any> {
    private walletService: IWalletService<any>;
    constructor(
        @inject(ITYPES.Service) service: IWalletService<any>,
    ) {
        super(service)
        this.walletService = service;
    }
    async findAll(req: any, res: any, next: any): Promise<any> {
        try {
            const result = await this.walletService.findAll({
                where: { user_wallets: {
                    user_id: req.user.id
                } },
                relations: {
                    user_wallets: true
                },
                select: {
                    user_wallets: true
                }
            });
            for (let wallet of result) {
                delete wallet.user_wallets;
            }
            res.json({
                rows: result,
                total: result.length
            });
        } catch (error) {
            next(error)
        }
    }
    async create(req: any, res: any, next: any): Promise<any> {
        try {
            if (!req.body) throw new Error("Data is required");
            const data = req.body;
            const result = await this.walletService.createWalletForUser(req.user.id, {data});
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
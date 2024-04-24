import { BaseController } from "@/controller/base/base.controller";
import { IWalletController } from "@/controller/interface/i.wallet.controller";
import { IWalletService } from "@/service/interface/i.wallet.service";
import { ITYPES } from "@/types/interface.types";
import { inject } from "inversify";

export class WalletController extends BaseController implements IWalletController<any> {
    constructor(
        @inject(ITYPES.Service) service: IWalletService<any>
    ) {
        super(service)
    }
}
import { BaseService } from "@/service/base/base.service";
import { IAccountService } from "@/service/interface/i.account.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class AccountService extends BaseService implements IAccountService<any>{
    constructor(@inject(ITYPES.Repository) repository: IAccountService<any>) {
        super(repository);
    }
}
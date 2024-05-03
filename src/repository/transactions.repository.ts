import { Transactions } from "@/models/transactions.model";
import { BaseRepository } from "@/repository/base/base.repository";
import { ITransactionsRepository } from "@/repository/interface/i.transactions.repository";
import { ITYPES } from "@/types/interface.types";
import { inject } from "inversify";
import { DataSource } from "typeorm";

export class TransactionsRepository extends BaseRepository<Transactions> implements ITransactionsRepository<Transactions>{
    constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
        super(dataSource.getRepository(Transactions))
    }
}
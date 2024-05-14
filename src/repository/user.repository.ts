import { User } from "@/models/user.model";
import { BaseRepository } from "@/repository/base/base.repository";
import { IUserRepository } from "@/repository/interface/i.user.repository";
import { ITYPES } from "@/types/interface.types";
import { inject } from "inversify";
import { DataSource } from "typeorm";

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository<User>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(User));
  }
  async updateDeviceToken(userId: string, deviceToken: string): Promise<any> {
    return await this._update({
      where: { id: userId },
      data: { deviceToken: deviceToken },
    });
  }
}

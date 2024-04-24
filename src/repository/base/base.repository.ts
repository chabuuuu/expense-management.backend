import { IBaseRepository } from "@/repository/interface/i.base.repository";
import BaseError from "@/utils/error/base.error";
import { log } from "console";
import { injectable } from "inversify";
import "reflect-metadata";
import { EntityNotFoundError } from "typeorm";
@injectable()
export class BaseRepository<T extends any> implements IBaseRepository<T> {
  protected _model;
  constructor(model: any) {
    this._model = model;
  }
  async _update(params: { where: any; data: any }): Promise<any> {
    try {
      const { where, data } = params;
      await this._model.findOneByOrFail(where);
      const result = await this._model.update(where, data);
      return Object.assign({ updateData: data }, { where: where }, result)
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BaseError(404, 'fail', "Entity not found")
      }
    }
  }
  async _delete(params: { where: any }): Promise<any> {
    try {
      const { where } = params;
      const removedEntity = await this._model.findOneByOrFail(where);
      const result = await this._model.remove(removedEntity);
      return Object.assign({ deleteData: result }, { where: where })
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BaseError(404, 'fail', "Entity not found")
      }
      throw error
    }

  }
  async _findOne(params: { where?: any }): Promise<any> {
    try {
      const { where } = params;
      return await this._model.findOne({
        where,
      });
    } catch (error) {
      throw error
    }
  }
  async _findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    order?: any;
    relations?: any;
    select?: any;
  }): Promise<any> {
    try {
      const { skip, take, where, order, relations, select } = params;

      return this._model.find({
        skip,
        take,
        where,
        order,
        relations, 
        select
      })
    } catch (error) {
      throw error
    }
  }
  async _create(params: { data: any }): Promise<any> {
    try {
      const { data } = params;
      const newInstance = await this._model.create(data);
      return await this._model.save(newInstance);
    } catch (error) {
      throw error
    }
  }

  async _exists(params: { where: any }): Promise<boolean> {
    try {
      const { where } = params;
      const result = await this._model.exists({
        where,
      });
      console.log(result);
      
      return result;
    } catch (error) {
      throw error
    }
  }
}
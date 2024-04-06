export interface IBaseService<T> {
    create(data: any): Promise<T>;
    update(params: any): Promise<T>;
    delete(params: any): Promise<T>;
    findOne(params: any): Promise<T>;
    findAll(params: any): Promise<any>;
}
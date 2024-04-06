export interface IBaseRepository<T> {
    _create(data: any): Promise<T>;
    _update(params: any): Promise<T>;
    _delete(params: any): Promise<T>;
    _findOne(params: any): Promise<T>;
    _findAll(params: any): Promise<any>;
}
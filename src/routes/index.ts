import accountRouter from "@/routes/account/account.route";
import roleRouter from "@/routes/role/role.route";
import BaseError from "@/utils/error/base.error";

export function route (app : any, root_api: string){
    app.use(`${root_api}/account`, accountRouter);
    app.use(`${root_api}/role`, roleRouter)
    app.all('*', (req: any, res: any, next: any) => {
        const status = 'fail';
        const statusCode = 404;
        const err = new BaseError(statusCode, status, 'API Not Exists');
        next(err);
    });
}
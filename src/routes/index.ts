import accountRouter from "@/routes/account/account.route";
import categoryRouter from "@/routes/category/category.route";
import roleRouter from "@/routes/role/role.route";
import userRouter from "@/routes/user/user.route";
import walletRouter from "@/routes/wallet/wallet.route";
import BaseError from "@/utils/error/base.error";

export function route (app : any, root_api: string){
    app.use(`${root_api}/account`, accountRouter);
    app.use(`${root_api}/role`, roleRouter);
    app.use(`${root_api}/category`, categoryRouter);
    app.use(`${root_api}/user`, userRouter);
    app.use(`${root_api}/wallet`, walletRouter);
    app.all('*', (req: any, res: any, next: any) => {
        const status = 'fail';
        const statusCode = 404;
        const err = new BaseError(statusCode, status, 'API Not Exists');
        next(err);
    });
}
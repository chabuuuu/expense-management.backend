import { error } from "console";

export function formatResponse (req: any, res: any, next: any){
    var send = res.json;
    console.log('res.json::: ', res.json);
    
    res.json = function (body: any) {    
        console.log('body::: ', body);
        if (body.status !== 'fail'){
                body = {
                    status: {
                        code: 200,
                        message: 'Request successful'
                    },
                    data: body
                }
        }else{
            body = {
                status: {
                    code: body.code || 500,
                    message: body.message || 'Request failed',
                    error_code: body.error_code || 'HttpException'
                },
                data: null,
            }
        }

        send.call(this, body);
    };
    next();
}
import { objectIsEmpty } from "@/utils/check-null/check-null-object";
import BaseError from "@/utils/error/base.error";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";

export async function classValidateUtil(Dto: any, payload: any): Promise<any> {
    try {        
        console.log('payload', payload);
        if (objectIsEmpty(payload)){
            return new Dto();
        }
        const dtoInstance = plainToInstance(Dto, payload);
        const validateErrors = await validate(dtoInstance, { validationError: { target: false, value: false } })
        if (validateErrors.length > 0) {
            const formatError = validateErrors.map((error: any) => (
                Object.values(error.constraints).join(', ')
            ))            
            throw new BaseError(400, 'fail', formatError)
        }
        return dtoInstance;
    } catch (error: any) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'fail', error.message);
    }
}
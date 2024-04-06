import BaseError from "@/utils/error/base.error";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const classValidate = (Dto: any) => async (req: any, res: any, next: any) => {
    try {
        const dtoInstance = plainToInstance(Dto, req.body);
        const validateErrors = await validate(dtoInstance, { validationError: { target: false, value: false } })
        if (validateErrors.length > 0) {
            const formatError = validateErrors.map((error: any) => (
                Object.values(error.constraints).join(', ')
            ))            
            throw new BaseError(400, 'fail', formatError)
        }
        next()
    } catch (error) {
        next(error)
    }
}
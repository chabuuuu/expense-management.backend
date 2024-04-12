import BaseError from "@/utils/error/base.error";
import { StatusCodes } from "http-status-codes";
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from "typeorm";

export const errorHanlder = (error: any, req: any, res: any, next: any) => {
  console.log("Error::: " + error);
  let message = (error as any).message.message;
  let code = "HttpException";
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let status = 'fail'
  let errorResponse;
  switch (error.constructor) {
    case BaseError:
      error.statusCode = error.statusCode || 500;
      error.status = error.status || "error";
      statusCode = error.statusCode;
      errorResponse = {
        code: error.statusCode,
        status: 'fail',
        message: error.message,
        error_code: 'base_error'
      };
      break;
    case QueryFailedError:
      statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
      message = (error as any).message;
      if (
        error.hasOwnProperty("detail") &&
        (error as any).detail !== undefined
      ) {
        message += "- detail: " + (error as any).detail;
      }
      code = (error as any).code;
      errorResponse = { status, message, error_code: code, code: statusCode }
      break;
    case EntityNotFoundError:
      statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
      message = (error as EntityNotFoundError).message;
      code = (error as any).code;
      errorResponse = { status, message, error_code: code,  code: statusCode }
      break;
    case CannotCreateEntityIdMapError:
      statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
      message = (error as CannotCreateEntityIdMapError).message;
      code = (error as any).code;
      errorResponse = { status, message, error_code: code,  code: statusCode }
      break;
    default:
        message = error.message
        errorResponse = {status, message, error_code: code,  code: statusCode}
      break;
  }
  console.log('Error Response::: ', errorResponse);
  
  res.status(statusCode).json(errorResponse);
};

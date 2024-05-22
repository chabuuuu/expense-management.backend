import { userService } from "@/container/user.container";
import BaseError from "@/utils/error/base.error";
import { log } from "console";
import { StatusCodes } from "http-status-codes";

const jwt = require('jsonwebtoken');

export async function authenticateJWT(req: any, res: any, next: any) {
    try {
    var token: string = req.header('Authorization');
    if (!token) {
        throw new BaseError(StatusCodes.UNAUTHORIZED, 'fail', 'You need to login first')
    }
      if (token != null){
        token = token.split('Bearer ')[1];
      }
    //console.log(token);
      await jwt.verify(
        token,
        process.env.JWT_SECRET,
        async (err: any, user: any) => {
          if (err) {
            console.log('token error: ', err);
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'fail', 'You need to login first')
          }
          const findedUser = await userService.findOne({
            where: {
              id: user.id,
            },
          });
          if (!findedUser) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'fail', 'User not found')
          }
          // if (findedUser.password != user.password) {
          //   throw new BaseError(StatusCodes.BAD_REQUEST, 'fail', 'Password is incorrect')
          // }
          console.log('User login:::', findedUser);
          req.user = findedUser;
          next();
        },
      );
    } catch (error: any) {
      next(error);
    }
  }
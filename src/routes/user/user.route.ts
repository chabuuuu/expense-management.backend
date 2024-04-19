import { userController } from "@/container/user.container";
import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { classValidate } from "@/middleware/class-validate.middleware";
import express from "express";

const userRouter = express.Router();

userRouter
  .post("/login", userController.login.bind(userController))
  .post(
    "/register",
    classValidate(UserRegisterDto),
    userController.register.bind(userController)
  )
  .put("/:id", userController.update.bind(userController))
  .delete(":/id", userController.delete.bind(userController))
  .get("/verify-phone-number", userController.verifyPhoneNumber.bind(userController))
  .get("/:id", userController.findOne.bind(userController))
  .get("", userController.findAll.bind(userController));

export default userRouter;

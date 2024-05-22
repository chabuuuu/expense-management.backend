import { userController } from "@/container/user.container";
import { ChangePasswordDto } from "@/dto/user/change-password.dto";
import { ResetPasswordDto } from "@/dto/user/forget-password.dto";
import { UpdateDeviceTokenDto } from "@/dto/user/update-device-token.dto";
import { UserLoginDto } from "@/dto/user/user-login.dto";
import { UserModifyDto } from "@/dto/user/user-modify.dto";
import { UserRegisterDto } from "@/dto/user/user-register.dto";
import { classValidate } from "@/middleware/class-validate.middleware";
import { authenticateJWT } from "@/middleware/jwt.authenticate.middleware";
import express from "express";

const userRouter = express.Router();

userRouter

  .post("/reset-password", authenticateJWT, classValidate(ResetPasswordDto), userController.resetPassword.bind(userController))
  .post("/forget-password", authenticateJWT, userController.forgetPassword.bind(userController))
  .post("/login", classValidate(UserLoginDto), userController.login.bind(userController))
  .post(
    "/register",
    classValidate(UserRegisterDto),
    userController.register.bind(userController)
  )
  .put("/update-device-token", classValidate(UpdateDeviceTokenDto), authenticateJWT, userController.updateDeviceToken.bind(userController))
  .put("/change-password", classValidate(ChangePasswordDto), authenticateJWT, userController.changePassword.bind(userController))
  .put("/profile", classValidate(UserModifyDto), authenticateJWT, userController.update.bind(userController))
  .delete(":/id", userController.delete.bind(userController))
  .get("/verify-phone-number", userController.verifyPhoneNumber.bind(userController))
  .get("/profile", authenticateJWT, userController.getProfile.bind(userController));
  // .get("/:id", userController.findOne.bind(userController))
  // .get("", userController.findAll.bind(userController));

export default userRouter;

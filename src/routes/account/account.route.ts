import { accountController } from "@/container/account.container";
import { CreateAccountDto } from "@/dto/account/create-account.dto";
import { classValidate } from "@/middleware/class-validate.middleware";
import express from "express";
const accountRouter = express.Router();
accountRouter
  .post(
    "/create",
    classValidate(CreateAccountDto),
    accountController.create.bind(accountController)
  )
  .get("/", accountController.findAll.bind(accountController));

export default accountRouter;

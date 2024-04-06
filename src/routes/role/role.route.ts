import { roleController } from "@/container/role.container";
import { CreateRoleDto } from "@/dto/role/create-role.dto";
import { UpdateRoleDto } from "@/dto/role/update-role.dto";
import { classValidate } from "@/middleware/class-validate.middleware";
import express from "express";
const roleRouter = express.Router();

roleRouter
  .post(
    "/create",
    classValidate(CreateRoleDto),
    roleController.create.bind(roleController)
  )
  .put(
    "/update/:id",
    classValidate(UpdateRoleDto),
    roleController.update.bind(roleController)
  )
  .delete("/delete/:id", roleController.delete.bind(roleController))

  .get("/", roleController.findAll.bind(roleController));

export default roleRouter;

import { budgetController } from '@/container/budget.container';
import { CreateBudgetDto } from '@/dto/budget/create-budget.dto';
import { classValidate } from '@/middleware/class-validate.middleware';
import { authenticateJWT } from '@/middleware/jwt.authenticate.middleware';
import express from 'express';

const budgetRouter = express.Router();

budgetRouter

.post("/create", classValidate(CreateBudgetDto), authenticateJWT, budgetController.create.bind(budgetController))
.put("/update/:id", authenticateJWT, budgetController.update.bind(budgetController))
.delete("/:id", authenticateJWT, budgetController.delete.bind(budgetController))
.get("/list", authenticateJWT, budgetController.findAll.bind(budgetController))
.get("/:id", authenticateJWT, budgetController.findOne.bind(budgetController))

export default budgetRouter;
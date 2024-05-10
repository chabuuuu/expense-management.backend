import { budgetController } from '@/container/budget.container';
import { CreateBudgetDto } from '@/dto/budget/create-budget.dto';
import { CreateNoRenewBudgetDto } from '@/dto/budget/create-no-renew-budget.dto';
import { CreateRenewBudgetDto } from '@/dto/budget/create-renew-budget.dto';
import { UpdateBudgetDto } from '@/dto/budget/update-budget.dto';
import { classValidate } from '@/middleware/class-validate.middleware';
import { authenticateJWT } from '@/middleware/jwt.authenticate.middleware';
import express from 'express';

const budgetRouter = express.Router();

budgetRouter

.post("/create/no-renew", classValidate(CreateNoRenewBudgetDto), authenticateJWT, budgetController.createNoRenewBudget.bind(budgetController))

.post("/create/renew", classValidate(CreateRenewBudgetDto), authenticateJWT, budgetController.createRenewBudget.bind(budgetController))

//.post("/create", classValidate(CreateBudgetDto), authenticateJWT, budgetController.create.bind(budgetController))

.put("/update/:id", classValidate(UpdateBudgetDto),  authenticateJWT, budgetController.update.bind(budgetController))

.put("/reset-expensed-amount/:id", authenticateJWT, budgetController.resetExpensedAmount.bind(budgetController))

.delete("/:id", authenticateJWT, budgetController.delete.bind(budgetController))

.get("/list", authenticateJWT, budgetController.findAllBudgetOfMe.bind(budgetController))

.get("/:id", authenticateJWT, budgetController.findOne.bind(budgetController))

export default budgetRouter;
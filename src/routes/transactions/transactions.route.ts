import { transactionsController } from '@/container/transactions.container';
import { CreateTransactionsDto } from '@/dto/transactions/create-transactions.dto';
import { classValidate } from '@/middleware/class-validate.middleware';
import { authenticateJWT } from '@/middleware/jwt.authenticate.middleware';
import express from 'express'

const transactionsRouter = express.Router();

transactionsRouter

.post('/', authenticateJWT, classValidate(CreateTransactionsDto), transactionsController.createMyTransactions.bind(transactionsController))
//.put('/:id', transactionsController.update.bind(transactionsController))
.delete('/:id', transactionsController.update.bind(transactionsController))
.get('/me', authenticateJWT, transactionsController.findAllMyTransactions.bind(transactionsController))
.get(':/id', transactionsController.findOne.bind(transactionsController))

export default transactionsRouter;
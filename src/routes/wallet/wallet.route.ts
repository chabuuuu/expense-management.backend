import { walletController } from '@/container/wallet.container';
import { CreateWalletDto } from '@/dto/wallet/create-wallet.dto';
import { UpdateWalletDto } from '@/dto/wallet/update-wallet.dto';
import { classValidate } from '@/middleware/class-validate.middleware';
import { authenticateJWT } from '@/middleware/jwt.authenticate.middleware';
import express from 'express'

const walletRouter = express.Router();

walletRouter

.post("/create", classValidate(CreateWalletDto), authenticateJWT, walletController.create.bind(walletController))
.put("/update/:id", classValidate(UpdateWalletDto), authenticateJWT, walletController.update.bind(walletController))
.delete("/:id", authenticateJWT, walletController.delete.bind(walletController))
.get("/list", authenticateJWT, walletController.findAll.bind(walletController))
.get("/:id", authenticateJWT, walletController.findOne.bind(walletController))

export default walletRouter;
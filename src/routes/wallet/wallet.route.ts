import { walletController } from '@/container/wallet.container';
import express from 'express'

const walletRouter = express.Router();

walletRouter

.post("/create", walletController.create.bind(walletController))
.put("/update/:id", walletController.update.bind(walletController))
.delete("delete/:id", walletController.delete.bind(walletController))
.get("/list", walletController.findAll.bind(walletController))
.get("/:id", walletController.findOne.bind(walletController))
import { categoryController } from '@/container/category.container';
import { CreateCategoryDto } from '@/dto/category/create-category.dto';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';

const categoryRouter = express.Router();

categoryRouter

.post('/', classValidate(CreateCategoryDto), categoryController.create.bind(categoryController))
.put('/:id', categoryController.update.bind(categoryController))
.delete('/:id', categoryController.delete.bind(categoryController))
.get('/:id', categoryController.findOne.bind(categoryController))
.get('/', categoryController.findAll.bind(categoryController))

export default categoryRouter;
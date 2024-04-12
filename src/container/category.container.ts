import { CategoryController } from "@/controller/category.controller";
import { ICategoryController } from "@/controller/interface/i.category.controller";
import { AppDataSource } from "@/database/db.datasource";
import { Category } from "@/models/category.model";
import { CategoryRepository } from "@/repository/category.repository";
import { ICategoryRepository } from "@/repository/interface/i.category.repository";
import { CategoryService } from "@/service/category.service";
import { ICategoryService } from "@/service/interface/i.category.service";
import { ITYPES } from "@/types/interface.types";
import { Container } from "inversify";

const categoryContainer = new Container();

categoryContainer.bind<ICategoryService<any>>(ITYPES.Service).to(CategoryService);
categoryContainer.bind<ICategoryController<any>>(ITYPES.Controller).to(CategoryController);
categoryContainer.bind<ICategoryRepository<Category>>(ITYPES.Repository).to(CategoryRepository);
categoryContainer.bind(ITYPES.Datasource).toConstantValue(AppDataSource);

const categoryController = categoryContainer.get<ICategoryController<any>>(ITYPES.Controller);
const categoryService = categoryContainer.get<ICategoryService<any>>(ITYPES.Service);

export {categoryController, categoryService}
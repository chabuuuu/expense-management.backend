import { CategoryType } from "@/enums/category-type.enum";
import { Category } from "@/models/category.model";
import { ICategoryRepository } from "@/repository/interface/i.category.repository";
import { BaseService } from "@/service/base/base.service";
import { ICategoryService } from "@/service/interface/i.category.service";
import { ITYPES } from "@/types/interface.types";
import { inject, injectable } from "inversify";

@injectable()
export class CategoryService extends BaseService implements ICategoryService<any>{
    constructor(@inject(ITYPES.Repository) repository: ICategoryRepository<any>) {
        super(repository);
    }
    async createDefaultCategories(userId: string): Promise<any> {
        try {
            let category = new Category();
            category.name = 'Working';
            category.type = CategoryType.INCOME;
            category.picture = "https://assets-global.website-files.com/6509fe179d7033a278a05268/652771a2ad43d990a8837c07_Blog-feature-HR-Pillar.png"
            category.user_id = userId;
            await this.repository._create({data: category});

            category.name = 'Eating';
            category.type = CategoryType.EXPENSE;
            category.picture = "https://media.istockphoto.com/id/886145548/vector/child-eating-broccoli.jpg?s=612x612&w=0&k=20&c=wQ-nWXQsqPS9NRPnjqjPhbJd9FHAL9etMuP-bQNVyNI="
            category.user_id = userId;
            await this.repository._create({data: category});

            category.name = 'Transportation';
            category.type = CategoryType.EXPENSE;
            category.picture = "https://okcredit-blog-images-prod.storage.googleapis.com/2021/02/transportation.jpg"
            category.user_id = userId;
            await this.repository._create({data: category});

            category.name = 'Education';
            category.type = CategoryType.EXPENSE;
            category.picture = "https://habitatbroward.org/wp-content/uploads/2020/01/10-Benefits-Showing-Why-Education-Is-Important-to-Our-Society.jpg"
            category.user_id = userId;
            await this.repository._create({data: category});

            category.name = 'Entertainment';
            category.type = CategoryType.EXPENSE;
            category.picture = "https://etimg.etb2bimg.com/photo/81478822.cms"
            category.user_id = userId;
            await this.repository._create({data: category});

            category.name = 'Health';
            category.type = CategoryType.EXPENSE;
            category.picture = "https://media.dolenglish.vn/PUBLIC/MEDIA/e7fba51d-5daa-4e4c-a14a-9246b21f2322.jpeg"
            category.user_id = userId;
            await this.repository._create({data: category});

            category.name = 'Shopping';
            category.type = CategoryType.EXPENSE;
            category.picture = "https://tinhteads.com/wp-content/uploads/2019/05/google-shoping.jpg"
            category.user_id = userId;
            await this.repository._create({data: category});
        } catch (error) {
            throw error;
        }
    }
}
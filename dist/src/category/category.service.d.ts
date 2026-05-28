import { DatabaseService } from '../database/database.service';
export declare class CategoryService {
    private readonly db;
    constructor(db: DatabaseService);
    getAllCategories(): Promise<any>;
    createCategory(name: string): Promise<{
        message: string;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
}
